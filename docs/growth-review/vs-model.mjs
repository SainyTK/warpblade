// Vampire Survivors (Mad Forest, Antonio) run model from wiki tables in /tmp/vs-research.md.
// Modelled parts are marked "est". Output: JSON with per-minute bands and one median results screen.
const E = { re: [5, 1], lit: [1, 1], zom: [10, 1], ske: [15, 2], gho: [10, 1.5], gry: [70, 2.5], grn: [150, 2.5], gbat: [270, 2.5],
  wolf: [180, 2], manti: [500, 3], mum: [500, 3], ven: [500, 3], flow: ["L30", 2], glow: ["L50", 30] };
// minute: [enemy minimum, spawn interval s, wave enemies]
const WAVES = [[15,1,["re"]],[30,1,["zom","lit"]],[50,.5,["lit","re","re"]],[40,.25,["ske"]],[30,1,["ske","gho"]],[10,1,["grn"]],[20,.5,["zom","grn"]],[80,.5,["re","re","gry"]],[100,1.5,["zom"]],[30,.5,["gbat","zom"]],[10,.5,["gry","grn"]],[300,.1,["ske"]],[20,.25,["wolf","gho","ske"]],[150,.5,["wolf","gho","gho"]],[20,.1,["gbat","wolf"]],[100,.1,["wolf","gbat","grn"]],[100,.1,["manti","gry","grn"]],[20,1,["mum"]],[60,.5,["mum","gry"]],[100,.5,["mum","gry"]],[100,.1,["mum","grn","gbat"]],[300,.1,["flow"]],[200,.1,["flow","mum"]],[300,.1,["flow","mum"]],[300,.1,["flow","mum"]],[100,.1,["ven"]],[150,.1,["ven","flow"]],[300,.1,["mum","gry","grn"]],[300,.1,["gbat","glow"]],[300,.1,["glow","glow"]]];
// enemies to kill: the Flower Wall ring stands still and Glowing and Silver Bats carry chests, so they are left out;
// a minute with nothing else takes the enemies of the minute before
const FIGHT = []; WAVES.forEach(([, , types], m) => { const t = types.filter((k) => typeof E[k][0] !== "string"); FIGHT.push(t.length ? t : FIGHT[m - 1]); });
const hpOf = (k, lv) => { const h = E[k][0]; return typeof h === "string" ? +h.slice(1) * lv : h; };
const hpOf0 = (m) => FIGHT[m].reduce((a, k) => a + hpOf(k, 1), 0) / FIGHT[m].length;
const EVO_CHEST = new Set([10,12,14,15,16,18,20,22,23,25,27,29]);
const BRONZE = new Set([1,3,5,7,9]);
// weapon tables: damage, amount, cycle seconds per level 1-8; crowd = enemies one attack reaches in a dense crowd (est)
const W = {
  whip:  { r: 100, d: [10,10,15,20,25,30,35,40], a: [1,2,2,2,2,2,2,2], c: [1.35], crowd: 3, area: true, evo: { name: "Bloody Tear", needs: "heart", d: 40*1.1, a: 2, c: 1.35, crowd: 4 } },
  wand:  { r: 100, d: [10,10,10,10,20,20,20,30], a: [1,2,2,3,3,4,4,4], c: [1.2,1.2,1,1,1,1,1,1], crowd: 1, amt: true, evo: { name: "Holy Wand", needs: "tome", d: 30, a: 4, c: 0.5, crowd: 1.5 } },
  knife: { r: 100, d: [6.5,6.5,11.5,11.5,11.5,11.5,16.5,16.5], a: [1,2,3,4,4,5,6,6], c: [1], crowd: 1.5, amt: true, evo: { name: "Thousand Edge", needs: "bracer", d: 16.5, a: 6, c: 0.35, crowd: 2.5 } },
  bible: { r: 80, d: [10,10,10,20,20,20,30,30].map((x, i) => x * [3,3,3,3.5,3.5,3.5,4,4][i] / 1.7), a: [1,2,2,2,3,3,3,4], c: [6,6,6,6.5,6.5,6.5,7,7], crowd: 4, amt: true, area: true, dur: true, evo: { name: "Unholy Vespers", needs: "binder", d: 30 * 3 / 1.7, a: 4, c: 3, crowd: 6 } },
  garlic:{ r: 70, d: [5,7,8,9,11,12,13,15], a: [1], c: [1.3,1.3,1.2,1.2,1.1,1.1,1,1], crowd: 5, area: true, evo: { name: "Soul Eater", needs: "pumm", d: 50, a: 1, c: 1, crowd: 10 } },
  santa: { r: 100, d: [10,10,20,20,30,30,35,40].map((x, i) => x / 0.3 * [2,2,2.5,2.5,2.75,2.75,3,3][i] * 0.5), a: [1,2,2,3,3,4,4,4], c: [4.5], crowd: 5, amt: true, area: true, dur: true, evo: { name: "La Borra", needs: "orb", d: 40 / 0.3 * 4 * 0.3, a: 4, c: 4, crowd: 6 } },
  rune:  { r: 80, d: [10,15,20,20,25,30,30,30].map((x, i) => x * [2.25,2.25,2.5,2.5,2.5,2.75,2.75,3.25][i] / 1.5), a: [1,1,1,2,2,2,3,3], c: [5.25,5.25,5.5,5.5,5.5,5.75,5.75,6.25], crowd: 4, amt: true, dur: true, evo: { name: "NO FUTURE", needs: "armor", d: 30 * 3 / 0.75, a: 1, c: 4, crowd: 6 } },
  fire:  { r: 80, d: [20,30,40,50,60,70,80,90], a: [3], c: [3], crowd: 1.2, amt: true, evo: { name: "Hellfire", needs: "spinach", d: 100, a: 2, c: 3, crowd: 5 } },
};
const NAMES = { whip: "Whip", wand: "Magic Wand", knife: "Knife", bible: "King Bible", garlic: "Garlic", santa: "Santa Water", rune: "Runetracer", fire: "Fire Wand" };
const P = { spinach: [100,5], tome: [50,5], dup: [50,2], candle: [100,5], bracer: [100,5], binder: [100,5], clover: [100,5], crown: [70,5], orb: [100,5], heart: [90,5], pumm: [90,5], armor: [100,5], wings: [50,5] };
const at = (arr, i) => arr[Math.min(i, arr.length - 1)];
function rng(seed) { let s = seed >>> 0 || 1; return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function density(min) { return Math.min(1, (WAVES[min][0] + 10) / 120); }
// damage per second of one weapon on a crowd, with passives
function weaponDps(id, lv, evolved, inv, level, min) {
  const w = W[id], p = (k) => inv.p[k] ?? 0;
  const s = evolved ? { d: w.evo.d, a: w.evo.a, c: w.evo.c, crowd: w.evo.crowd } : { d: at(w.d, lv - 1), a: at(w.a, lv - 1), c: at(w.c, lv - 1), crowd: w.crowd };
  const might = 1 + 0.1 * p("spinach") + Math.min(0.5, 0.1 * Math.floor(level / 10));
  const cd = 1 / (1 - 0.08 * p("tome"));
  const amt = w.amt ? (s.a + p("dup")) / s.a : 1;
  const dur = w.dur ? 1 + 0.1 * p("binder") : 1;
  const crowd = 1 + (s.crowd * (w.area ? 1 + 0.1 * p("candle") : 1) - 1) * density(min);
  const single = (s.d * s.a) / s.c * might * cd * amt * dur;
  return { single, crowd: single * crowd };
}
function totals(inv, level, min) {
  let single = 0, crowd = 0; const per = {};
  for (const [id, lv] of Object.entries(inv.w)) { const d = weaponDps(id, lv, inv.evo[id], inv, level, min); single += d.single; crowd += d.crowd; per[id] = d.crowd; }
  return { single, crowd, per };
}
function offers(inv, R, luck) {
  const pool = [];
  const wn = Object.keys(inv.w).length, pn = Object.keys(inv.p).length;
  for (const [id, w] of Object.entries(W)) { const lv = inv.w[id]; if (lv ? lv < 8 && !inv.evo[id] : wn < 6) pool.push({ k: "w", id, wt: w.r * (lv ? 3 : 1) }); }
  for (const [id, [r, max]] of Object.entries(P)) { const lv = inv.p[id]; if (lv ? lv < max : pn < 6) pool.push({ k: "p", id, wt: r * (lv ? 3 : 1) }); }
  const n = R() < 1 - 1 / luck ? 4 : 3, out = [];
  while (out.length < n && pool.length) { let t = pool.reduce((a, c) => a + c.wt, 0) * R(); const i = pool.findIndex((c) => (t -= c.wt) <= 0); out.push(pool.splice(i < 0 ? 0 : i, 1)[0]); }
  return out;
}
const apply = (inv, o) => { const t = o.k === "w" ? inv.w : inv.p; t[o.id] = (t[o.id] ?? 0) + 1; };
const clone = (inv) => ({ w: { ...inv.w }, p: { ...inv.p }, evo: { ...inv.evo } });
// planner: value = crowd damage now, counting a weapon as evolved when its partner is owned (the plan it is working toward)
function potential(inv, level, min) {
  const fut = clone(inv); for (const id of Object.keys(fut.w)) if (inv.p[W[id].evo.needs] || inv.evo[id]) { fut.evo[id] = true; }
  const now = totals(inv, level, min).crowd, plan = totals(fut, level, Math.max(min, 15)).crowd;
  return now + 0.35 * plan + 15 * (inv.p.heart ?? 0) + 10 * (inv.p.armor ?? 0);
}
const choosers = {
  planner: (opts, inv, level, min) => opts.reduce((b, o) => { const t = clone(inv); apply(t, o); const v = potential(t, level, min); return v > b.v ? { o, v } : b; }, { o: opts[0], v: -1 }).o,
  random: (opts, _i, _l, _m, R) => opts[Math.floor(R() * opts.length)],
};
const xpToNext = (L) => { const k = (l) => Math.min(5 + 1.5 * Math.floor((l - 1) / 20), 8); return k(L + 1) * L * L - k(L) * (L - 1) ** 2; };
function run(seed, chooser) {
  const R = rng(seed);
  const inv = { w: { whip: 1 }, p: {}, evo: {} };
  let level = 1, xp = 0;
  const mins = [], dmg = { whip: 0 }, gains = [];
  const first = {};
  for (let min = 0; min < 30; min++) {
    const [minimum, interval] = WAVES[min];
    const types = FIGHT[min];
    const hp = types.reduce((a, k) => a + hpOf(k, level), 0) / types.length;
    const ex = types.reduce((a, k) => a + E[k][1], 0) / types.length;
    const arrivals = minimum + (60 / interval) * types.length; // the minimum refilled once plus one of each wave type per spawn interval
    for (let tick = 0; tick < 10; tick++) {
      const t = totals(inv, level, min);
      const killsTick = Math.min(arrivals / 10, (t.crowd * 6) / hp);
      const used = (killsTick * hp) / Math.max(1e-9, t.crowd * 6);
      for (const [id, v] of Object.entries(t.per)) dmg[id] = (dmg[id] ?? 0) + v * 6 * used;
      const growth = 1 + 0.08 * (inv.p.crown ?? 0) + (level === 20 || level === 40 ? 1 : 0);
      xp += killsTick * ex * growth;
      while (xp >= xpToNext(level)) {
        xp -= xpToNext(level); level++;
        const opts = offers(inv, R, 1 + 0.1 * (inv.p.clover ?? 0));
        if (opts.length) { const before = totals(inv, level, Math.max(min, 12)).crowd; const o = chooser(opts, inv, level, min, R); apply(inv, o); gains.push(totals(inv, level, Math.max(min, 12)).crowd / before); if (o.k === "w" && !first[o.id]) first[o.id] = min; }
      }
    }
    const minute = min + 1;
    if (BRONZE.has(minute) || EVO_CHEST.has(minute)) {
      const ready = EVO_CHEST.has(minute) && Object.keys(inv.w).find((id) => inv.w[id] === 8 && !inv.evo[id] && inv.p[W[id].evo.needs]);
      if (ready) { const before = totals(inv, level, Math.max(min, 12)).crowd; inv.evo[ready] = true; gains.push(totals(inv, level, Math.max(min, 12)).crowd / before); }
      else { const up = Object.keys(inv.w).filter((id) => inv.w[id] < 8 && !inv.evo[id]); if (up.length) inv.w[up[Math.floor(R() * up.length)]]++; }
    }
    const t = totals(inv, level, Math.min(29, minute));
    const nhp = FIGHT[Math.min(29, minute)].reduce((a, k) => a + hpOf(k, level), 0) / FIGHT[Math.min(29, minute)].length;
    mins.push({ minute, level, single: t.single, crowd: t.crowd, coverage: Math.min(1, (t.crowd * 60) / nhp / arrivals), ttk: hpOf0(min) / t.single });
  }
  const results = Object.entries(dmg).map(([id, d]) => ({ id, name: inv.evo[id] ? W[id].evo.name : NAMES[id], level: inv.evo[id] ? "evo" : inv.w[id], damage: d, from: first[id] ?? 0 })).sort((a, b) => b.damage - a.damage);
  return { mins, results, inv, level, gains, build: Object.keys(inv.w).sort().map((id) => (inv.evo[id] ? W[id].evo.name : NAMES[id])).join(' + ') };
}
const pct = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(p * (s.length - 1))]; };
function band(name, n = 2000) {
  const runs = Array.from({ length: n }, (_, i) => run(5000 + i, choosers[name]));
  const series = Array.from({ length: 30 }, (_, m) => {
    const f = (k, p) => pct(runs.map((r) => r.mins[m][k]), p);
    return { minute: m + 1, crowd: [f("crowd", .1), f("crowd", .5), f("crowd", .9)], single: [f("single", .1), f("single", .5), f("single", .9)], level: [f("level", .1), f("level", .5), f("level", .9)], coverage: [f("coverage", .1), f("coverage", .5), f("coverage", .9)], ttk: f("ttk", .5) };
  });
  const finals = runs.map((r) => r.mins[29].crowd).sort((a, b) => a - b);
  const median = runs.find((r) => r.mins[29].crowd === pct(finals, .5));
  const builds = {}; for (const r of runs) builds[r.build] = (builds[r.build] ?? 0) + 1;
  const g = runs.flatMap((r) => r.gains);
  return { series, median: median.results, medianLevel: median.level, final: finals, gains: [pct(g, .1), pct(g, .5), pct(g, .9), pct(g, .99)], gainsAll: g.filter((_, i) => i % 7 === 0), topBuild: Math.max(...Object.values(builds)) / n, builds: Object.keys(builds).length };
}
const enemies = WAVES.map(([minimum, interval], m) => ({ minute: m, minimum, interval, hp: FIGHT[m].reduce((a, k) => a + hpOf(k, 1), 0) / FIGHT[m].length, arrivals: minimum + (60 / interval) * FIGHT[m].length }));
const out = { planner: band("planner"), random: band("random"), enemies, startDps: totals({ w: { whip: 1 }, p: {}, evo: {} }, 1, 0) };
console.log(JSON.stringify(out));
