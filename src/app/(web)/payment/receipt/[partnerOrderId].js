'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // 수정된 임포트 경로
import { fetchExtended, apiUrl } from '../../../../utils/fetchExtended';

const Receipt = () => {
  const [receipt, setReceipt] = useState(null);
  const router = useRouter();
  const { partnerOrderId } = router.query; // URL에서 partnerOrderId 추출

  useEffect(() => {
    if (!partnerOrderId) return; // partnerOrderId 없을 경우 함수 종료

    const fetchData = async () => {
      const queryString = new URLSearchParams({ partnerOrderId }).toString();
      const endpoint = `/api/order/receipt?${queryString}`; // 쿼리 스트링을 사용하여 요청
      try {
        const response = await fetchExtended(apiUrl + endpoint, {
          method: 'GET',
        });

        const data = await response.json();
        if (!data) throw new Error('데이터 로딩 실패');
        setReceipt(data);
      } catch (error) {
        console.error('Error fetching receipt data:', error);
      }
    };

    fetchData();
  }, [partnerOrderId]);

  if (!receipt) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h1>Receipt for Order ID: {partnerOrderId}</h1>
      {/* Receipt 내용 렌더링 */}
    </div>
  );
}

export default Receipt;