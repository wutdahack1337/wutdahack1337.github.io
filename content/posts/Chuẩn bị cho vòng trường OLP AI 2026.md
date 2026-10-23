---
title: Chuẩn bị cho vòng trường OLP AI 2026
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


- Block 2: Data Preparation & Dataset Class & Data Loader & Validation Strategy 
- Block 3: Modeling & Hyperparemeter
- Block 4: Training & Validation Loop 
- Block 5: Inference & Submission 


NLP
pretrained
không pretrained

Computer Vision
pretrained
không pretrained






