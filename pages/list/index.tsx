import { useQuery } from '@tanstack/react-query';
import { EMPTY_LIST_URL, SEARCH_AS } from 'constants/common';
import Image from 'next/image';
import { ChangeEvent, useEffect } from 'react';
import useFetch from 'hooks/useFetch';
import useSearch from 'hooks/useSearch';
import { getLikeBuildingIds } from 'apis/api';
import { CategoryType, OrderType } from 'types/client.types';
import BuildingCard from 'components/commons/BuildingCard';
import SearchInput from 'components/commons/SearchInput';
import ListCategoryTabs from 'components/pages/list/ListCategoryTabs';
import ListCheckBoxs from 'components/pages/list/ListCheckBoxs';
import ListSortingButton from 'components/pages/list/ListSortingButton';
import PageButton from 'components/pages/list/PageButton';

type ExtendedCategoryType = CategoryType & '전체';

const List = () => {
  const {
    q,
    setQ,
    as,
    setAs,
    order,
    setOrder,
    cate,
    setCate,
    isours,
    setIsours,
    iscurrent,
    setIscurrent,
    page,
    setPage,
  } = useSearch();

  const { searchResult } = useFetch({
    q,
    as,
    order,
    cate,
    isours,
    iscurrent,
    page,
  });

  // TODO: 데이터 꼬임 현상 (7/16): 로그아웃이 되면 likeBuildingIds가 null이 될 수 있게
  const { data: likeBuildingIds } = useQuery({
    queryKey: ['likeBuildingIds'],
    queryFn: () => getLikeBuildingIds(),
  });

  const handleClickCategoryTab = (category: string) => {
    setPage('1');
    setCate(category as ExtendedCategoryType);
  };

  const handleSelectSortButton = (e: ChangeEvent<HTMLSelectElement>) => {
    setPage('1');
    const order = e.target.value as OrderType;
    setOrder(order);
  };

  const handleClickOurs = () => {
    setPage('1');
    setIsours((prev) => !prev);
  };

  const handleClickIsPopup = () => {
    setPage('1');
    setIscurrent((prev) => !prev);
  };

  const setValue = (q: string) => {
    setPage('1');
    setQ(q);
  };

  return (
    <div className='flex justify-center'>
      <div className='mb-56 mt-76 flex h-full w-full max-w-1232 flex-col justify-center gap-24 md:my-8 md:gap-12 md:px-16'>
        <span className='text-32 font-800 md:text-24'>{cate || '전체'}</span>
        <ListCategoryTabs
          cate={cate}
          onClickCategoryTab={handleClickCategoryTab}
        />
        <div className='flex justify-between md:flex-col md:gap-16'>
          <div className='w-394 flex'>
            <SearchInput
              value={q}
              setValue={setValue}
              dropdownMenu={SEARCH_AS}
              selectedMenu={as}
              setSelectedMenu={setAs}
            />
          </div>
          <div className='flex items-center gap-8'>
            <ListCheckBoxs
              isours={isours}
              iscurrent={iscurrent}
              onClickOurs={handleClickOurs}
              onClickIsPopup={handleClickIsPopup}
            />
            <ListSortingButton onSelected={handleSelectSortButton} />
          </div>
        </div>
        {/* card-list */}
        {searchResult?.result.length === 0 ? (
          <div className='flex h-[60dvh] w-full flex-col items-center justify-center gap-20'>
            <div className='relative h-152 w-152'>
              <Image
                src={EMPTY_LIST_URL}
                alt='비어있는 리스트 이미지'
                fill
                className='object-cover'
              />
            </div>
            <div className='flex flex-col items-center justify-center text-18'>
              <span>조건과 일치하는 건물이 없습니다.</span>
            </div>
          </div>
        ) : (
          <div className='mx-auto my-20 grid grid-cols-3 gap-x-24 gap-y-48 md:my-0 md:grid-cols-2 md:gap-y-24'>
            {searchResult?.result.map((building) => (
              <BuildingCard
                mode='like'
                key={building._id}
                _id={building._id}
                building={building}
                isLiked={likeBuildingIds?.includes(building._id)}
              />
            ))}
          </div>
        )}
        <PageButton
          count={searchResult?.count ?? 0}
          selectedPage={Number(page)}
          setPage={setPage}
        />
      </div>
    </div>
  );
};

export default List;
