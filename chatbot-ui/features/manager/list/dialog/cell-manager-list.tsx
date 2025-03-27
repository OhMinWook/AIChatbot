// 'use client';

// import { useEffect, useState } from 'react';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogFooter,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog/_dialog.config';
// import { Button } from '@/components/ui/button';
// import UserReport from '@/features/answer/dialog/user-report-dialog';
// import { getAnswerReportIdAction } from '@/actions/admin-answer';
// import { useRouter } from 'next/navigation';
// import { endOfDay, format, startOfDay } from 'date-fns';

// interface DialogUserReportProps {
//   login_id: number;
//   val: string | number;
// }

// export default function DialogUserReport({
//   login_id,
//   val,
// }: DialogUserReportProps) {
//   const today = new Date();
//   const [startDate, setStartDate] = useState<Date>(startOfDay(today));
//   const [endDate, setEndDate] = useState<Date>(endOfDay(today));
//   const [isOpen, setIsOpen] = useState(false);
//   const [reportData, setReportdata] = useState<any>({});

//   const router = useRouter();
//   const dataConfirmHandler = (mId: number, sId: string) => {
//     const startDateParam = format(startDate, 'yyyyMMdd');
//     const endDateParam = format(endDate, 'yyyyMMdd');
//     if (!mId || !sId) return setIsOpen(false);
//     router.push(
//       `/admin/manual/list?startDate=${startDateParam}&endDate=${endDateParam}&manualId=${mId}&screenId=${sId}`,
//     );
//   };

//   useEffect(() => {
//     const getReportData = async () => {
//       try {
//         const data = await getAnswerReportIdAction(login_id);
//         setReportdata(data.data);
//       } catch (e) {
//         console.log(`error : `, e);
//       }
//     };

//     if (isOpen) {
//       getReportData();
//     }
//   }, [login_id, isOpen]);

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <div>
//         <DialogTrigger asChild>
//           <p className='cursor-pointer hover:underline'>{val}</p>
//         </DialogTrigger>
//       </div>

//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>사용자 리포트</DialogTitle>
//         </DialogHeader>
//         <UserReport reportData={reportData} />
//         <DialogFooter>
//           <section className='w-full flex justify-center py-[16px] border-t border-customColor-bg1_1'>
//             <Button
//               variant='enter2'
//               className='py-[13px]'
//               onClick={() =>
//                 dataConfirmHandler(reportData.manual_id, reportData.screen_id)
//               }
//             >
//               해당 데이터 확인
//             </Button>
//           </section>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
