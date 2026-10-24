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

device = torch.device("cuda" if torch.cuda.is_available() else "cpu)

SEED=1337
np.random.seed(SEED)
torch.manual_seed(SEED)
if device == "cuda":
	torch.cuda.manual_seed(SEED)


EPOCHS=10
LR = 3e-4 or 1e-3 or 1e-4
WD = 0.01 (default) -> 0.1
BATCH_SIZE=16
```


- Block 2: Data Preparation & Dataset Class
    - Inspect tập dữ liệu: có mất cân bằng không? 
    - Làm giàu dữ liệu nếu dữ liệu bị thiếu, còn dữ liệu đầy đủ rồi mà làm giàu thì chỉ tốn thêm thời gian mà thôi: transforms với ảnh, sinh dữ liệu giả với text và feature engineering với dữ liệu bảng.
    - Xây dựng Class Dataset, có 3 hàm bắt buộc: `__init__`, `__len__`, `__getitem__` - mình cũng chưa rành món này lắm, sẽ first principle sau 
```python
from torchvision import transforms
from torch.utils.data import DataLoader

MEAN = [0.485, 0.456, 0.406]
STD = [0.229, 0.224, 0.225]

train_transform = 

test_transform = 
```

- Block 3: Validation Strategy & Data Loader
    - Chia tập train test 1 cách hợp lý, có 2 cách, cách đầu tiên là sử dụng train_test_split (sử dụng stratify=y để mà cân bằng nhãn) để mà chạy được MVP trước cái đã, nếu mọi chuyện đã hợp tình hợp lý rồi thì chuyển qua sử dụng K-Fold để sinh ra K models dựa trên tập dữ liệu và lấy trung bình kết quả của K models nó để quyết định kết quả cuối cùng 
    - Tạo train_loader và val_loader với num_workers và pin_memory=True để tăng tốc nạp dữ liệu vào GPU 
```python
train_test_split(X, y, test_size=0.2, stratify=y, random_state=SEED)
```

- Block 4: Modeling & Hyperparemeter
    - Khởi tạo kiến trúc của model, sửa lại lớp cuối cùng cho phù hợp với bài toán 
    - Đẩy model lên device 
    - Tiêu chuẩn
        - Loss: CrossEntropyLoss (Phân loại đa lớp), BCEWithLogitLoss (Đa nhãn/Nhị phân), MSELoss (Hồi quy) 
        - Optimizer: AdamW 
        - Scheduler: ConsineAnnealingLR 
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
- Block 6: Inference & Submission 
    - Khởi tạo lại kiến trúc model trắng từ đầu, load_weight thừ best_model.pth
    - Xây dựng TestDataset (không có nhãn) và test_loader
    - prediction loop with inference_mode()
    - lưu kết quả và xuất submission.csv 


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








