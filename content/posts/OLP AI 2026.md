---
title: OLP AI 2026
date: 2026-10-23
---
![[Pasted image 20261023213509.png]]


# Thi cá nhân

Nơi tập luyện:
- https://www.deep-ml.com/problems
- https://www.tensortonic.com/problems


# Thi đồng đội

Nơi tập luyện:
- https://www.kaggle.com/competitions

Khung
- Block 1: Global Config & Reproducibility 
    - Định nghĩa toàn bộ hằng số
    - Cố định tất cả seed 
```python
import torch
import numpy as np

SEED = 1337
random.seed(SEED)
np.random.seed(SEED)
torch.manual_seed(SEED)
torch.cuda.manual_seed(SEED)

device = "cuda" if torch.cuda.is_available() else "cpu"
print(device)

TEST_SIZE = 0.2
WORKERS = 2
IMAGE_SIZE = 224
EPOCHS = 10
BATCH_SIZE = 16
LR = 5e-4
WD = 1e-4
```


- Block 2: Validation Strategy & Data Augmentation
    - Inspect tập dữ liệu: có mất cân bằng không? 
    - Làm giàu dữ liệu nếu dữ liệu bị thiếu, còn dữ liệu đầy đủ rồi mà làm giàu thì chỉ tốn thêm thời gian mà thôi: transforms với ảnh, sinh dữ liệu giả với text và feature engineering với dữ liệu bảng.
    - Xây dựng Class Dataset, có 3 hàm bắt buộc: `__init__`, `__len__`, `__getitem__` - mình cũng chưa rành món này lắm, sẽ first principle sau 
```python
from torchvision import transforms
from torch.utils.data import DataLoader

MEAN = [0.485, 0.456, 0.406]
STD = [0.229, 0.224, 0.225]

train_transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)) or transforms.RandomResizedCrop((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(MEAN, STD),
])

val_transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(MEAN, STD),
])
```

- Block 3: Dataset & Data Loader
    - Chia tập train test 1 cách hợp lý, có 2 cách, cách đầu tiên là sử dụng train_test_split (sử dụng stratify=y để mà cân bằng nhãn) để mà chạy được MVP trước cái đã, nếu mọi chuyện đã hợp tình hợp lý rồi thì chuyển qua sử dụng K-Fold để sinh ra K models dựa trên tập dữ liệu và lấy trung bình kết quả của K models nó để quyết định kết quả cuối cùng 
    - Tạo train_loader và val_loader với num_workers và pin_memory=True để tăng tốc nạp dữ liệu vào GPU 
```python
train_test_split(X, y, test_size=TEST_SIZE, stratify=y, random_state=SEED)

train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=WORKERS, pin_memory=True, persistent_workers=True, prefetch_factor=WORKERS)

val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=WORKERS, pin_memory=True, persistent_workers=True)
```

- Block 4: Modeling & Hyperparemeter
    - Khởi tạo kiến trúc của model, sửa lại lớp cuối cùng cho phù hợp với bài toán 
    - Đẩy model lên device 
    - Tiêu chuẩn
        - Loss: CrossEntropyLoss (Phân loại đa lớp), BCEWithLogitLoss (Đa nhãn/Nhị phân), MSELoss (Hồi quy) 
        - Optimizer: AdamW 
        - Scheduler: CosineAnnealingLR 
- Block 5: Training & Validation Loop 
    - khởi tạo scaler (GradScaler)
    - train mode (model.train()):
        - loop qua train_loader
        - optimizer.zero_grad()
        - with torch.autocast(device) -> Tính output -> Tính loss
        - scaler.scale(loss).backward() -> scaler.step(optimizer) -> scaler.update()
	- eval mode (model.eval()) & torch.inference_mode():
	    - loop qua val_loader 
	    - Lưu lại model tốt nhất, nên ghi nhận lại model tốt nhất mọi thời đại luôn, có nghĩa là phải so sánh giữa model tốt nhất trước đó và model tốt nhất hiện tại chứ không phải là lưu lại lung tung 
	- scheduler.step()
```python
best_val_acc = 0.0
for epoch in range(EPOCHS):
    # Training Phase
    model.train()
    train_loss = 0.0
    train_correct = 0
    train_total = 0

    train_pbar = tqdm(train_loader, desc=f"Epoch {epoch+1}/{EPOCHS} [Train]")
    for images, labels in train_pbar:
        images = images.to(device, non_blocking=True)
        labels = labels.to(device, non_blocking=True)
        
        optimizer.zero_grad(set_to_none=True)
        
        # Mixed precision forward pass
        with torch.amp.autocast("cuda"):
            outputs = model(images)
            loss = criterion(outputs, labels)
            
        # Scaled backward pass & optimization
        scaler.scale(loss).backward()
        scaler.step(optimizer)
        scaler.update()
        
        train_loss += loss.item() * images.size(0)
        _, predicted = outputs.max(1)
        train_total += labels.size(0)
        train_correct += predicted.eq(labels).sum().item()
        
        train_pbar.set_postfix(loss=f"{loss.item():.4f}", acc=f"{train_correct/train_total:.4f}")
        
    train_loss /= train_total
    train_acc = train_correct / train_total

    # Validation Phase
    model.eval()
    val_loss = 0.0
    val_correct = 0
    val_total = 0
    
    with torch.no_grad():
        val_pbar = tqdm(val_loader, desc=f"Epoch {epoch+1}/{EPOCHS} [Val]")
        for images, labels in val_pbar:
            images = images.to(device, non_blocking=True)
            labels = labels.to(device, non_blocking=True)
            
            with torch.amp.autocast("cuda"):
                outputs = model(images)
                loss = criterion(outputs, labels)
                
            val_loss += loss.item() * images.size(0)
            _, predicted = outputs.max(1)
            val_total += labels.size(0)
            val_correct += predicted.eq(labels).sum().item()
            
            val_pbar.set_postfix(loss=f"{loss.item():.4f}", acc=f"{val_correct/val_total:.4f}")
            
    val_loss /= val_total
    val_acc = val_correct / val_total
    
    scheduler.step()

    print(f"Epoch {epoch+1} Summary | Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.4f} | Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.4f}")
    
    # Save the best model based on validation accuracy
    if val_acc > best_val_acc:
        best_val_acc = val_acc
        torch.save(model.state_dict(), "best_model.pth")
        print(f"-> Saved new best_model.pth with Val Acc: {best_val_acc:.4f}")
```
- Block 6: Inference & Submission 
    - Khởi tạo lại kiến trúc model trắng từ đầu, load_weight thừ best_model.pth
    - Xây dựng TestDataset (không có nhãn) và test_loader
    - prediction loop with inference_mode()
    - lưu kết quả và xuất submission.csv 
```python
test_df = pd.read_csv(DATA_DIR / "test.csv")
test_dataset = Dataset(test_df, transform=val_transform, is_test=True)
test_loader = DataLoader(test_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=WORKERS, pin_memory=True, persistent_workers=True)
```

**Machine Learning**

Feature Engineering + (CatBoost -> XGBoost)


**Computer Vision**

|                | Pretrained                | From scratch                                         |
| -------------- | ------------------------- | ---------------------------------------------------- |
| Classification | Efficientnet_b2           | Augmentation + Optimizer + Regularization + Resnet18 |
| OCR            | stepfun-ai/GOT-OCR-2.0-hf | CRNN + BiLSTM + nn.CTCLoss()                         |
| Vietnamese OCR | vgg_transformer           |                                                      |


**NLP**

|                | Pretrained                                                                         | From scatch                                                                                                         |
| -------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Classification | microsoft/trocr-base-printed (text images)<br>or<br>TF-IDF + XGBoost (normal text) | TF-IDF Vectorizer + LogisticRegression/LinearSVC<br>or<br>BiLSTM 1-2 lớp + nn.Embedding + SpatialDropout1d(0.2)<br> |
| Dịch máy       |                                                                                    | nltk + Transformer                                                                                                  |

**Google Colab**

- mount -> copy dataset from drive (/content/drive)

**Kaggle**
- /kaggle/input: dataset 
- /kaggle/working: submission, best_model 








