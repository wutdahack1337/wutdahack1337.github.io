Best Val Dice: 0.1620

----
EPOCHS=15, train_mvp=1000, val_mvp = 100, BATCH_SIZE=8
0.1959 
Test: Precision(Micro)=0.5812 | Recall(Micro)=0.2364 | Macro Dice=0.2783 | IoU(Micro)=0.2020 | Accuracy(Micro)=0.9931
FCD: Precision(Micro)=0.9347 | Recall(Micro)=0.0283 | Macro Dice=0.0526 | IoU(Micro)=0.0283 | Accuracy(Micro)=0.9634
SCD: Precision(Micro)=0.8746 | Recall(Micro)=0.0176 | Macro Dice=0.0193 | IoU(Micro)=0.0176 | Accuracy(Micro)=0.9901

---
EPOCHS=10, train_mvp=1500, val_mvp = 200, BATCH_SIZE=16, ENCODER_LR = 1e-4, DECODER_LR = 1e-3
Best Val Dice: 0.1456
Test: Precision(Micro)=0.0000 | Recall(Micro)=0.0000 | Macro Dice=0.2900 | IoU(Micro)=0.0000 | Accuracy(Micro)=0.9931
FCD: Precision(Micro)=0.0000 | Recall(Micro)=0.0000 | Macro Dice=0.0000 | IoU(Micro)=0.0000 | Accuracy(Micro)=0.9634
SCD: Precision(Micro)=0.0000 | Recall(Micro)=0.0000 | Macro Dice=0.0000 | IoU(Micro)=0.0000 | Accuracy(Micro)=0.9908

---
EPOCHS=20, train_mvp=1500, val_mvp = 200, BATCH_SIZE=8, ENCODER_LR = 5e-4, DECODER_LR = 5e-3
Best Val Dice: 0.4800
Test: Precision(Micro)=0.5572 | Recall(Micro)=0.5322 | Macro Dice=0.3984 | IoU(Micro)=0.3740 | Accuracy(Micro)=0.9938
FCD: Precision(Micro)=0.9311 | Recall(Micro)=0.1425 | Macro Dice=0.2136 | IoU(Micro)=0.1410 | Accuracy(Micro)=0.9682
SCD: Precision(Micro)=0.5410 | Recall(Micro)=0.2133 | Macro Dice=0.2718 | IoU(Micro)=0.1806 | Accuracy(Micro)=0.9911

---
EPOCHS=20, train_mvp=1500, val_mvp = 200, BATCH_SIZE=4, ENCODER_LR = 5e-4, DECODER_LR = 5e-3
thử nghiệm batch nhỏ hơn thì có ngon hơn không
Best Val Dice: 0.4859
Test: Precision(Micro)=0.5772 | Recall(Micro)=0.4952 | Macro Dice=0.4253 | IoU(Micro)=0.3634 | Accuracy(Micro)=0.9940
FCD: Precision(Micro)=0.9495 | Recall(Micro)=0.1683 | Macro Dice=0.2362 | IoU(Micro)=0.1668 | Accuracy(Micro)=0.9692
SCD: Precision(Micro)=0.5274 | Recall(Micro)=0.2230 | Macro Dice=0.2540 | IoU(Micro)=0.1859 | Accuracy(Micro)=0.9910
-> kết luận: batch càng nhỏ là càng tốt, tại sao? 

