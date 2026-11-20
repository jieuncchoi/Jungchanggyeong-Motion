# Jungchanggyeong-Motion

저장소 루트에서 정적 서버를 실행합니다.

```sh
python3 -m http.server 8000
```

브라우저에서 `http://localhost:8000/`을 엽니다. 첫 진입 시 앞면의 격자와 그래픽이 차례로 나타납니다. 카드 위로 마우스를 올리면 뒷면이 보이고, 마우스를 빼면 앞면으로 돌아갑니다. 키보드의 Enter 또는 Space와 터치로도 전환할 수 있습니다.

앞면과 뒷면은 원본 SVG를 사용합니다. `reference.mov`는 회전 속도와 이징을 맞추는 데 참고한 영상입니다.
