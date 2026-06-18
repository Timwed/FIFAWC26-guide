import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-8xl font-extrabold text-slate-600">404</p>
      <h2 className="mt-4 text-2xl font-bold">页面未找到</h2>
      <p className="mt-2 text-sm text-slate-400">
        你访问的页面不存在，可能已被移动或删除
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          to="/"
          className="rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400"
        >
          返回首页
        </Link>
        <Link
          to="/schedule"
          className="rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-slate-300 transition hover:bg-white/10"
        >
          查看赛程
        </Link>
      </div>
    </div>
  );
}
