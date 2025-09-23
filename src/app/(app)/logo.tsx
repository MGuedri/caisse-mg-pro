import { cn } from "@/lib/utils";

export const Logo = ({ size = 'lg', className }: { size?: 'sm' | 'lg', className?: string }) => {
  const isLarge = size === 'lg';

  return (
    <div className={cn(
      "flex flex-col items-center justify-center font-bold font-headline select-none",
      isLarge ? 'gap-2' : 'gap-1',
      className
    )}>
      <div className="flex items-center justify-center">
        <span className={cn(
          "text-white",
          isLarge ? 'text-7xl' : 'text-3xl'
        )}>
          MG
        </span>
        <span className={cn(
          "text-orange-500 font-black",
          isLarge ? 'text-2xl -ml-2 -mt-4' : 'text-lg -ml-1 -mt-2'
        )}>
          -
        </span>
        <svg
          viewBox="0 0 100 100"
          className={cn(
            "fill-current text-orange-500",
            isLarge ? 'w-8 h-8 -ml-2 -mt-1' : 'w-5 h-5 -ml-1 mt-0'
          )}
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="0,0 100,0 50,75" />
        </svg>
      </div>
      {isLarge && (
        <span className="text-2xl text-white tracking-widest font-light -mt-4">
          CAISSE
        </span>
      )}
    </div>
  );
};
