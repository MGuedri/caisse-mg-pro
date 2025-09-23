import { cn } from "@/lib/utils";

export const Logo = ({ size = 'lg', className }: { size?: 'sm' | 'lg', className?: string }) => {
  const isLarge = size === 'lg';

  return (
    <div className={cn(
      "flex flex-col items-center justify-center font-bold font-headline select-none",
      isLarge ? 'gap-4' : 'gap-1',
      className
    )}>
      <div className={cn(
        "relative flex items-center justify-center bg-transparent rounded-full border-white",
        isLarge ? 'w-24 h-24 border-4' : 'w-10 h-10 border-2'
      )}>
        <span className={cn(
          "font-black text-primary", // Orange M
          isLarge ? 'text-5xl' : 'text-xl'
        )}>
          M
        </span>
        <span className={cn(
          "font-black text-blue-500 absolute", // Blue G
          isLarge ? 'text-5xl left-[52%]' : 'text-xl left-[52%]'
        )}>
          G
        </span>
      </div>
      {isLarge && (
        <span className="text-xl text-white tracking-widest font-light">
          Café Mon Plaisir
        </span>
      )}
    </div>
  );
};
