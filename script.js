/**
     * 仕組み：
     * 1) 各トラックの中身をクローンして末尾に追加 → [A][A] の並びを作る
     * 2) CSSアニメーションで translateX を 0% → -50%（または逆）に動かす
     *    → 継ぎ目のない無限ループ
     * 3) トラックの実幅に応じてアニメ時間をスケール（オプション）
     */

function setupInfiniteMarquee(track, { baseDuration = 16, reverse = false } = {}) {
  if (!track) return;

  // 画像読み込み完了後に正しい幅を取得
  const imgs = track.querySelectorAll('img');
  let loaded = 0;
  imgs.forEach(img => {
    if (img.complete) { loaded++; }
    else { img.addEventListener('load', () => { loaded++; if (loaded === imgs.length) init(); }, { once: true }); }
  });
  if (loaded === imgs.length) init();

  function init() {
    // 1巡分の子要素を複製して末尾に追加
    const children = Array.from(track.children);
    children.forEach(el => track.appendChild(el.cloneNode(true)));

    // 実幅からアニメ速度を自然に（px/s ≈ 120〜180 を目安に）
    const totalWidth = children.reduce((acc, el) => acc + el.getBoundingClientRect().width, 0) + (children.length - 1) * parseFloat(getComputedStyle(track).gap || 0);
    const pxPerSec = 140; // 調整可：大きいと速い
    const duration = Math.max(8, Math.round((totalWidth / pxPerSec)));

    track.style.animationDuration = `${duration}s`;

    // 方向の上書き（必要なら）
    if (reverse) {
      track.style.animationName = 'marquee-ltr';
    } else {
      track.style.animationName = 'marquee-rtl';
    }

    // 2回目以降の初期化を防ぐ
    track.dataset.inited = 'true';
  }
}

// 上段＝右→左（サイトの slick の雰囲気に近い）
setupInfiniteMarquee(document.getElementById('track1'), { reverse: false });
// 下段＝左→右
setupInfiniteMarquee(document.getElementById('track2'), { reverse: true });
