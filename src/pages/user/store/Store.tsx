import React, { useEffect, useState } from 'react';
import { Title } from '../../main/MainStyle';
import {
  BlueText,
  ChargeContainer,
  GiftWrapper,
  LogContainer,
  PointContainer,
  PointText,
  PriceContainer,
  PriceText,
  PriceWrapper,
  StoreTop,
  StoreWrapper,
  StyledPointIcon,
} from './StoreStyle';
import { LinkText } from '../../../components/user/UserStyle';
import Gifticon from '../../../components/user/Gifticon';
import PaymentModal from '../../../components/user/PaymentModal';
import CoinLog from '../../../components/user/CoinLog';
import { useGifticonStore, userPointStore } from '../../../states/user/PointStore';
import { CheckPoint, FetchGiftList, FetchKakaoPayment, FetchPointHistory } from '../../../services/StoreApi';
import Coin from '../../../assets/Coin.png';

export default function Store() {
  const pointStore = userPointStore();
  const { setGifticons } = useGifticonStore();
  const [openPayment, setOpenPayment] = useState(false);
  const [charge, setCharge] = useState<{ amount: number; itemName: string }>({ amount: 0, itemName: '' });
  const [openLog, setOpenLog] = useState(false);

  //기프티콘 리스트 호출
  useEffect(() => {
    const fetchData = async () => {
      try {
        const gifticonData = await FetchGiftList();
        setGifticons(gifticonData);
        const points = await CheckPoint();
        pointStore.setPoint(points);
      } catch (error) {
        console.error('기프티콘 데이터 호출 실패:', error);
      }
    };

    fetchData();
  }, [setGifticons]);
  //포인트 구매
  const SelectAmount = (amount: number, itemName: string) => {
    setCharge({ amount, itemName });
    setOpenPayment(true);
  };

  const ChargeCoin = async (amount: number, itemName: string) => {
    try {
      await FetchKakaoPayment(amount, itemName);
      setOpenPayment(false);
    } catch (error) {
      console.error('포인트 구매 실패:', error);
    }
  };
  const CancleCharge = () => {
    setOpenPayment(false);
  };
  //사용 내역
  const OpenLog = async () => {
    setOpenLog(true);
    try {
      await FetchPointHistory();
    } catch (error) {
      console.error('포인트 로그 호출 실패:', error);
    }
  };
  const CancleLog = () => {
    setOpenLog(false);
  };
  return (
    <StoreWrapper>
      {openPayment && (
        <PaymentModal
          amount={charge.amount}
          itemName={charge.itemName}
          onConfirm={ChargeCoin}
          onCancel={CancleCharge}
        />
      )}
      {openLog && <CoinLog onCancel={CancleLog} />}
      <Title>상점</Title>
      <StoreTop>
        <PointContainer>
          <StyledPointIcon src={Coin} className="w-[6rem] h-[6rem] mb-5 " />
          <LogContainer>
            <PointText>코어</PointText>
            <BlueText>{pointStore.point} 코어 보유</BlueText>
            <LinkText className="text-end" onClick={OpenLog}>
              사용 로그 보기 &gt;
            </LinkText>
          </LogContainer>
        </PointContainer>
        <ChargeContainer>
          <PointText>코어 충전하기</PointText>
          <PriceWrapper>
            <PriceContainer onClick={() => SelectAmount(1000, '100 코어')}>
              <StyledPointIcon src={Coin} className="w-[4rem] h-[4rem]" />
              <PriceText>100코어 : 1000원</PriceText>
            </PriceContainer>
            <PriceContainer onClick={() => SelectAmount(5000, '500 코어')}>
              <StyledPointIcon src={Coin} className="w-[5rem] h-[5rem]" />
              <PriceText>500코어 : 5000원</PriceText>
            </PriceContainer>
            <PriceContainer onClick={() => SelectAmount(10000, '1000 코어')}>
              <StyledPointIcon src={Coin} className="w-[6rem] h-[6rem]" />
              <PriceText>1000코어 : 10000원</PriceText>
            </PriceContainer>
          </PriceWrapper>
        </ChargeContainer>
      </StoreTop>
      <Title>기프티콘</Title>
      <GiftWrapper>
        <Gifticon />
      </GiftWrapper>
    </StoreWrapper>
  );
}
