export default function NightSky() {
  return (
    <div className="night-sky" aria-hidden="true">
      <div className="sky-canvas">
        <div className="stars stars-1" />
        <div className="stars stars-2" />
        <div className="stars stars-3" />
        <div className="meteor m1" />
        <div className="meteor m2" />
        <div className="meteor m3" />
        <div className="avatar-comet c1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/avatar.png" alt="" className="comet-img" />
        </div>
        <div className="avatar-comet c2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/avatar.png" alt="" className="comet-img" />
        </div>
        <div className="avatar-comet c3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/avatar.png" alt="" className="comet-img" />
        </div>
      </div>
    </div>
  );
}
