
DCT là gì? 
fusion là gì? attention là gì? 

---
EPOCHS=20, train_mvp=2000, val_mvp = 500, BATCH_SIZE=8, ENCODER_LR = 5e-4, DECODER_LR = 5e-3. loss = BCE + Dice. DTD-lightweight 

thay từ MobileNetV3 thành effientNet-b0


---

EPOCHS=20, train_mvp=2000, val_mvp = 200, BATCH_SIZE=8, ENCODER_LR = 5e-4, DECODER_LR = 5e-3. loss = BCE + Dice

DTD-lighweight 
![[Pasted image 20261104182409.png]]

Best Val Dice: ==🟢0.5329==
Avg Dice:  0.3299499437021882

-> kết luận: ngon
![[Pasted image 20261104190217.png]]
![[Pasted image 20261104190240.png]]
![[Pasted image 20261104190337.png]]
![[Pasted image 20261104190252.png]]
![[Pasted image 20261104190316.png]]


---

EPOCHS=20, train_mvp=2000, val_mvp = 200, BATCH_SIZE=8, ENCODER_LR = 5e-4, DECODER_LR = 5e-3. loss = BCE + Dice. model = baseline + Frequency Features 
gắn cái mới vào đi bro 

Best Val Dice: ==🟢0.5322==

Avg Dice:  0.2941172975798448

-> 


---

EPOCHS=20, train_mvp=1500, val_mvp = 200, BATCH_SIZE=4, ENCODER_LR = 3e-4, DECODER_LR = 3e-3. loss = BCE + Dice 

thử giảm LR, vì ở mấy lần trước, những epoch cuối nó mới tăng val dice lên nhiều, chả biết vì sao nhưng mà có lẽ là do ở cuối lr nhỏ nên nó được gì đó chăng? nên t mới thử giảm lr 

Best Val Dice: ==🔴0.4546==
Test: Precision(Micro)=0.6137 | Recall(Micro)=0.4462 | Macro Dice=0.3972 | IoU(Micro)=0.3483 | Accuracy(Micro)=0.9942
FCD: Precision(Micro)=0.9211 | Recall(Micro)=0.1455 | Macro Dice=0.1925 | IoU(Micro)=0.1437 | Accuracy(Micro)=0.9683
SCD: Precision(Micro)=0.5839 | Recall(Micro)=0.1328 | Macro Dice=0.1857 | IoU(Micro)=0.1214 | Accuracy(Micro)=0.9912

-> kết luận: 

----

EPOCHS=20, train_mvp=1500, val_mvp = 200, BATCH_SIZE=4, ENCODER_LR = 5e-4, DECODER_LR = 5e-3. loss = BCE + Dice 
tăng batch vì batch bằng 2 train quá lâu. thay đổi loss vì BCE thì nó chỉ cần dự đoán toàn nền thôi là được rồi, điều đó là quá tào lao 

loss này đang làm rất tốt nhiệm vụ của mình 

Best Val Dice: ==🟢0.5086==
Test: Precision(Micro)=0.6454 | Recall(Micro)=0.4675 | Macro Dice=0.4093 | IoU(Micro)=0.3720 | Accuracy(Micro)=0.9945
FCD: Precision(Micro)=0.9496 | Recall(Micro)=0.0981 | Macro Dice=0.1451 | IoU(Micro)=0.0976 | Accuracy(Micro)=0.9668
SCD: Precision(Micro)=0.6956 | Recall(Micro)=0.1848 | Macro Dice=0.2291 | IoU(Micro)=0.1710 | Accuracy(Micro)=0.9918

-> kết luận: loss này ngon hơn nhiều ở tập train, nhưng nó giảm ở các tập test, wth 


---
EPOCHS=20, train_mvp=1500, val_mvp = 200, BATCH_SIZE=4, ENCODER_LR = 5e-4, DECODER_LR = 5e-3
thử nghiệm batch nhỏ hơn thì có ngon hơn không

hành vi của nó là như thế này, mấy epoch đầu và giữa thì khong thay đổi nhiều lắm, nhưng mà tới những epoch cuối nó mới tăng, tại sao? 

Best Val Dice: ==🟢0.4859==
Test: Precision(Micro)=0.5772 | Recall(Micro)=0.4952 | Macro Dice=0.4253 | IoU(Micro)=0.3634 | Accuracy(Micro)=0.9940
FCD: Precision(Micro)=0.9495 | Recall(Micro)=0.1683 | Macro Dice=0.2362 | IoU(Micro)=0.1668 | Accuracy(Micro)=0.9692
SCD: Precision(Micro)=0.5274 | Recall(Micro)=0.2230 | Macro Dice=0.2540 | IoU(Micro)=0.1859 | Accuracy(Micro)=0.9910
-> kết luận: batch càng nhỏ là càng tốt. tại sao? 

---
EPOCHS=20, train_mvp=1500, val_mvp = 200, BATCH_SIZE=8, ENCODER_LR = 5e-4, DECODER_LR = 5e-3
Best Val Dice: ==🟢0.4800==
Test: Precision(Micro)=0.5572 | Recall(Micro)=0.5322 | Macro Dice=0.3984 | IoU(Micro)=0.3740 | Accuracy(Micro)=0.9938
FCD: Precision(Micro)=0.9311 | Recall(Micro)=0.1425 | Macro Dice=0.2136 | IoU(Micro)=0.1410 | Accuracy(Micro)=0.9682
SCD: Precision(Micro)=0.5410 | Recall(Micro)=0.2133 | Macro Dice=0.2718 | IoU(Micro)=0.1806 | Accuracy(Micro)=0.9911

---
EPOCHS=10, train_mvp=1500, val_mvp = 200, BATCH_SIZE=16, ENCODER_LR = 1e-4, DECODER_LR = 1e-3
Best Val Dice: ==🔴0.1456==
Test: Precision(Micro)=0.0000 | Recall(Micro)=0.0000 | Macro Dice=0.2900 | IoU(Micro)=0.0000 | Accuracy(Micro)=0.9931
FCD: Precision(Micro)=0.0000 | Recall(Micro)=0.0000 | Macro Dice=0.0000 | IoU(Micro)=0.0000 | Accuracy(Micro)=0.9634
SCD: Precision(Micro)=0.0000 | Recall(Micro)=0.0000 | Macro Dice=0.0000 | IoU(Micro)=0.0000 | Accuracy(Micro)=0.9908

----
EPOCHS=15, train_mvp=1000, val_mvp = 100, BATCH_SIZE=8
Best Val Dice: 0.1959 
Test: Precision(Micro)=0.5812 | Recall(Micro)=0.2364 | Macro Dice=0.2783 | IoU(Micro)=0.2020 | Accuracy(Micro)=0.9931
FCD: Precision(Micro)=0.9347 | Recall(Micro)=0.0283 | Macro Dice=0.0526 | IoU(Micro)=0.0283 | Accuracy(Micro)=0.9634
SCD: Precision(Micro)=0.8746 | Recall(Micro)=0.0176 | Macro Dice=0.0193 | IoU(Micro)=0.0176 | Accuracy(Micro)=0.9901
