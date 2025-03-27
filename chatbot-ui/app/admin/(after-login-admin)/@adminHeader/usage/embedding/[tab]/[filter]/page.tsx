import AdminHeaderBox from '@/features/admin-header/component/admin-header-box';
import { getVariantFromPathname } from '@/lib/path-name';
import { headers } from 'next/headers';

export default function AdminHeaderUsage() {
  const headerList = headers();
  const pathname = headerList.get('x-current-path');
  const variant = getVariantFromPathname(pathname);

  return <AdminHeaderBox variant={variant} />;
}
