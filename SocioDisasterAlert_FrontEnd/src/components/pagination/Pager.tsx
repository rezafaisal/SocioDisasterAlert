import { clsx } from '@/utils/format';

type Props = {
  page: number | 'dots';
  active: boolean;
  onClick: (page: number) => void;
};

const Pager: React.FC<Props> = ({ page, active, onClick }) => {
  function handleClick() {
    if (page != 'dots') return onClick(page);
  }

  return (
    <button
      onClick={handleClick}
      disabled={active || page == 'dots'}
      className={clsx(
        'relative inline-flex items-center border px-4 py-2 text-sm font-medium',
        active
          ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50',
        page == 'dots' && '!text-gray-700 hover:!bg-white'
      )}
    >
      {page == 'dots' ? '...' : page}
    </button>
  );
};

export default Pager;
