// 'use client';
// import { getEmbeddingAction } from '@/actions/admin-usage';
// import { convertDateOption } from '@/lib/date-util';
// import { AdminUsageHistory } from '@/services/admin-use/admin-use.type';
// import {
//   InfiniteData,
//   keepPreviousData,
//   useInfiniteQuery,
// } from '@tanstack/react-query';
// import { QueryOption } from './infinite-scroll.type';

// interface useEmbeddingUsageListOption extends QueryOption {
//   initialData: InfiniteData<AdminUsageHistory[], number>;
// }

// export const useEmbeddingUsageList = ({
//   initialData,
//   startDate,
//   endDate,
// }: useEmbeddingUsageListOption) => {
//   return useInfiniteQuery({
//     queryKey: ['embedding-usage-list', startDate, endDate],
//     queryFn: async ({ pageParam = 1 }) => {
//       const embeddingUsageOption = {
//         pageIndex: pageParam,
//         pageSize: 10,
//         startDate,
//         endDate,
//       };
//       const embeddingUsageParams = convertDateOption(embeddingUsageOption);
//       const response = await getEmbeddingAction(embeddingUsageParams);
//       const tableData = response.data.response;

//       return tableData;
//     },
//     initialPageParam: 1,
//     getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
//       if (lastPage.length === 0) return undefined;

//       return lastPageParam + 1;
//     },

//     placeholderData: keepPreviousData,
//     refetchOnWindowFocus: true,
//     refetchOnMount: true,
//     initialData: initialData,
//   });
// };
