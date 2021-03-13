/**
 * Created by mhzed on 2016-08-16.
 */
const assert = require("assert");
const utf8 = require(".");

// test string contains: chinese/english/japanese/arabic
let str = `
站姿自由女神25美分硬币是美国铸币局1916至1930年间生产的一种25美分硬币，用于取代1892年投产的巴伯25美分硬币。硬币图案由雕塑家赫尔蒙·阿特金斯·麦克尼尔设计，正面刻有自由女神，背面刻有飞鹰。铸币局局长罗伯特·伍利误以为硬币设计依法必须在沿用25年后更换，所以在1915年就把更换巴伯版角币、25美分和半美元的事项列入日程。麦克尼尔递交的设计方案带有强烈的军事色彩，显示自由女神保持警惕、防范攻击。铸币局要求对原有设计作出多项修订，麦克尼尔修改后的设计还加上海豚代表美国东西两岸的两大洋。1916年末，铸币局官员没有知会设计师就大幅调整硬币图案，麦克尼尔在次年1月看到新版后表示不满。铸币局获得特别授权，允许麦克维尔按自己的意愿重新设计银币，雕刻师最终做出的其中一项设计就是给自由女神穿上锁子甲，挡住原本裸露的乳房。进入流通后，硬币所刻年份磨损很快，为解决这个问题，铸币局雕刻师于1925年调整设计。站姿自由女神25美分硬币于1931年停产，这年铸币局也完全没有生产25美分硬币。经国会授权，华盛顿25美分硬币于1932年投产，上面刻有首任美国总统乔治·华盛顿的肖像，纪念他的二百周年诞辰。
Banksia scabrella, commonly known as the Burma Road banksia, is a species of woody shrub in the genus Banksia. It is classified in the series Abietinae, a group of several species of shrubs with small round or oval flower spikes. It occurs in several isolated populations south of Geraldton, Western Australia; the largest is south and east of Mount Adams. Found on sandy soils in heathland or shrubland, it grows to 2 m (7 ft) high and 3 m (10 ft) across with fine needle-like leaves. Appearing in spring and summer, the flower spikes are tan to cream with purple styles. B. scabrella is killed by fire and regenerates by seed. Originally collected in 1966, it was one of several species previously considered to be forms of Banksia sphaerocarpa, before it was finally described by banksia expert Alex George in his 1981 revision of the genus. Like many members of the Abietinae, it is rarely seen in cultivation, but has been described as having horticultural potential.
昭和28年西日本水害とは、1953年（昭和28年）6月25日から6月29日にかけて九州地方北部（福岡県・佐賀県・熊本県・大分県）を中心に発生した、梅雨前線を原因とする集中豪雨による水害である。
阿蘇山・英彦山を中心に総降水量が1,000ミリを超える記録的な豪雨により、九州最大の河川である筑後川を始め白川など九州北部を流れる河川がほぼ全て氾濫、流域に戦後最悪となる水害をひき起こし死者・行方不明者1,001名、浸水家屋45万棟、被災者数約100万人という大災害となった。この水害により筑後川など九州北部の河川における治水対策が根本から改められることになり、現在においても基本高水流量の基準となっている
ترامب يدعو إلى اخضاع المهاجرين للولايات المتحدة لـ "اختبارات مشددة"
مرشح الحزب الجمهوري للانتخابات الرئاسية الامريكية، دونالد ترامب، يعرب عن نيته فرض إجراءات مشددة لاولئك الذين يرغبون بالهجرة الى الولايات المتحدة.
قبل 8 ساعة
𝌆
 العالم
ترامب "سيكون الأكثر تهورا" بين رؤساء الولايات المتحدة
أوباما: ترامب لا يصلح أن يكون رئيسا
𝌆
`;

assert.equal(utf8.toString(utf8.fromString(str)), str, 'same');
// console.log(utf8.toString(utf8.fromString(str)));
let beg = Date.now();
for (let i = 0; i < 4000; i++) {
  let strstr = utf8.toString(utf8.fromString(str));
}
console.log('took ' + (Date.now() - beg) + 'ms');
