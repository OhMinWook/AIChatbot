import { menuList, MenuType, SubMenuType } from '@/const/menu-list';
import Image from 'next/image';

interface ResultType {
  mainMenu: MenuType | null;
  subMenu: SubMenuType | null;
}

type GetDataFromVariant = (menuList: MenuType[], keys: string[]) => ResultType;

const getDataFromVariant: GetDataFromVariant = (menuList, keys) => {
  const result: ResultType = {
    mainMenu: null,
    subMenu: null,
  };

  if (keys.length === 0) return result;

  const mainMenu = menuList.find((menu) => menu.key === keys[0]);
  if (!mainMenu) return result;

  result.mainMenu = mainMenu;

  if (keys.length > 1 && mainMenu.hasSubmenu) {
    const subMenu = mainMenu?.subMenuList?.find(
      (subMenu) => subMenu.key === keys[1],
    );
    if (subMenu) {
      result.subMenu = subMenu;
    }
  }

  return result;
};

interface AdminHeaderBoxProps {
  variant: string[];
}

export default function AdminHeaderBox({ variant }: AdminHeaderBoxProps) {
  const { mainMenu, subMenu } = getDataFromVariant(menuList, variant);

  return (
    <section className='w-full h-full flex flex-col space-y-6 justify-center items-center'>
      <div className='w-full flex justify-start items-center space-x-1 md:space-x-2'>
        <div className='w-8 h-8 md:w-12 md:h-12 relative'>
          <Image src={mainMenu?.icon!} fill alt={'header-icon'} />
        </div>
        <div>
          <p className='text-2xl md:text-3xl font-semibold'>
            {mainMenu?.label}
          </p>
        </div>
      </div>
      <div className='w-full rounded-lg flex justify-start px-5 py-3 items-center border-1 border-customColor-bg2'>
        <p className='text-xl md:text-3xl text-customColor-gray2 py-3'>
          HOME &gt; {mainMenu?.label}&nbsp;
          {mainMenu?.hasSubmenu ? `> ${subMenu?.label}` : null}
        </p>
      </div>
    </section>
  );
}
