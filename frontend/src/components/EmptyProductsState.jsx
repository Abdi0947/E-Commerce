export default function EmptyProductsState({
  emoji = "🛒",
  title = "No products found",
  message,
  actionLabel,
  onAction,
  useMaterialIcon = false,
  materialIcon = "shopping_cart",
}) {
  return (
    <section className="py-10 animate-fade-in">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 sm:p-14 text-center shadow-sm">
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-5 animate-cart-float"
            aria-hidden
          >
            {useMaterialIcon ? (
              <span className="material-symbols-outlined text-[44px] sm:text-[52px] text-primary animate-cart-wiggle">
                {materialIcon}
              </span>
            ) : (
              <span className="text-[44px] sm:text-[52px] leading-none select-none">{emoji}</span>
            )}
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">{message}</p>
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="px-5 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-all"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
