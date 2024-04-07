# Qudditch

feat/payment 브랜치에서 작성

### fetch 함수를 이용하여 get요청시 여러개의 params가 필요할 경우의 요청코드

ref
https://velog.io/@diorjj/fetch%ED%95%A8%EC%88%98%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%98%EC%97%AC-get%EC%9A%94%EC%B2%AD%EC%8B%9C-%EC%97%AC%EB%9F%AC%EA%B0%9C%EC%9D%98-params%EA%B0%80-%ED%95%84%EC%9A%94%ED%95%A0%EA%B2%BD%EC%9A%B0-%EC%9A%94%EC%B2%AD%EC%BD%94%EB%93%9C

### 글꼴 설치 SB Aggro Light / Medium글꼴 설치 SB Aggro Light / Medium

ref
https://cheri.tistory.com/291
https://www.clipartkorea.co.kr/search/preview?cont_code=tc04170000414&total=&idx=5&menu=m&page=1&keyword=

**변경사항**

1. public/fonts/파일 4개 추가
2. global.css 코드 추가
3. tailwind.config.js 코드 추가

### 테이블 (Flowbite)

ref
https://flowbite.com/docs/components/tables/#table-foot

### 날짜선택 (option 추가)

ref
https://mui.com/x/react-date-pickers/date-calendar/

모듈 설치
npm i @mui/material @mui/x-date-pickers @date-io/dayjs dayjs @emotion/react @emotion/styled
@heroicons/react/20/solid

페이지 임포트
// date picker (mui)
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { TextField } from '@mui/material'
import dayjs from 'dayjs'
