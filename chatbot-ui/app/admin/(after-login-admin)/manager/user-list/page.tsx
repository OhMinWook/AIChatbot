import UserListContainer from '@/features/manager/user-list-container';

export default async function UserListPage() {
  return (
    <section className='w-full h-auto flex flex-col'>
      <article className='mt-20'>
        <UserListContainer />
      </article>
    </section>
  );
}
