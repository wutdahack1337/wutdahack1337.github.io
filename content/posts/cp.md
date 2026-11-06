---
title: cp
date: 2026-11-06
---

solving problems and solving problems fast are two different skills. you need to train them separately
- solve: khả năng tìm ra các giải cho 1 bài toán chưa biết cách làm -> học cách suy luận, khám phá cấu trúc
- fast: khả năng giải nhanh, code chính xác và tránh những lỗi không cần thiết -> nhận diện pattern, triển khai, debug và quản lý thời gian
nếu chỉ luyện contest, thì đó là fast nhiều hơn solve, bởi contest không có đủ thời gian để khám phá ra những ý tưởng hoàn toàn mới -> cần 2 chế độ luyện tập riêng
- deep practice - học cách giải bài chưa biết - problem archive
- speed practice - giải bài quen thuộc nhanh, chính xác - timed contest

### Deep practice
![[Pasted image 20261106081639.png]]

vùng ở giữa chính là nơi nên dành phần lớn thời gian để luyện tập

không nên phụ thuộc vào editorial, nên tạm bỏ 1 bài chưa giải được -> hỏi chatgpt bài đó cần những kiến thức gì để có thể giải được -> nếu chưa có kiến thức đó thì hãy đi học -> quay lại sau một tháng

**Đừng solve theo topic, mà rèn luyện khả năng nhận diện thuật toán**
kỹ năng nhận diện bài toán mới chính là thứ cần được rèn luyện, chứ không phải khả năng triển khai
mục tiêu:
- học thuật toán mới - luyện theo topic
- học cách nhận diện thuật toán - luyện mixed problems 

### Problem-solving checklist
A. Reading the problem
- [ ] Tại sao giới hạn này tồn tại? nếu bỏ giới hạn đó thì bài toán thay đổi như thế nào?
- [ ] điều gì bất thường trong đề bài?
- [ ] đề thực sự yêu cầu tính toán hoặc tối ưu điều gì?
- [ ] có thể chuyển bài toán thành 1 mô hình quen thuộc không?
B. Exploring the solution
- [ ] nếu giải 1 phiên bản đơn giản hơn thì sao?
- [ ] nếu n rất nhỏ thì sẽ giải bằng cách nào?
- [ ] nếu bỏ giới hạn thời gian và bộ nhớ thì sẽ giải bằng cách nào?
- [ ] có thể giải 1 query trước rồi tổng quát hóa không?
- [ ] có observation nào giúp giảm độ phức tạp không?
C. Before implementation
- [ ] Complexity đã phù hợp với Constraints chưa?
- [ ] Chứng minh thuật toán đúng chưa?
- [ ] Các edge cases và vị trí dễ sai là gì?
- [ ] Có cách nào implement đơn giản hơn không?
- [ ] Phần nào có thể gây TLE hoặc overflow
- [ ] Phần nào là bottleneck?
D. After failure
- [ ] hiểu sai đề hay thuật toán sai?
- [ ] lỗi nằm ở idea hay implementation
- [ ] có test nào phá vỡ giả định của t không?
- [ ] brute force có thực sự độc lập với bài toán chính không? 
E. After AC
- [ ] mất thời gian ở bước nào?
- [ ] có observation nào nhận ra quá muộn không?
- [ ] có thể đơn giản hóa implementation không?
- [ ] nếu gặp bài tương tự trong contest thì có nhận ra nhanh hơn không?