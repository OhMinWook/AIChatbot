import ManagerListContainer from '@/features/manager/manager-list-container';

export default async function ManagerPage() {
  return (
    <section className='w-full h-auto flex flex-col'>
      <article className='mt-20'>
        <ManagerListContainer />
      </article>
    </section>
  );
}
