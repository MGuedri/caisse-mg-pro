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
        <svg
          viewBox="0 0 100 50"
          className={cn(isLarge ? 'w-20 h-10' : 'w-8 h-4')}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feOffset dx="2" dy="2" in="SourceAlpha" result="offset" />
              <feGaussianBlur in="offset" stdDeviation="0" result="blur" />
              <feFlood floodColor="hsl(var(--chart-2))" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="shadow" />
              <feComponentTransfer in="shadow" result="shadow">
                <feFuncA type="linear" slope="1" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="shadow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="white"
            fontSize="48"
            fontFamily="PT Sans, sans-serif"
            fontWeight="900"
            filter="url(#shadow)"
          >
            MG
          </text>
        </svg>
      </div>
    </div>
  );
};
