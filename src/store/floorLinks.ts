/**
 * Parts of the floor maps that lead to another floor or venue: the
 * "↑ ground floor ↑" / "to Vooruit" direction labels and the stairs, ramps and
 * bridge they belong to. Tapping one switches the map to the floor it leads to.
 *
 * Geometry is in the floor map's coordinates, taken from the Tectonic 26 Master
 * File (Figma, "Clean Floor Plans", bottom-half frames).
 */
export interface FloorLink {
  /** Floor the shape is drawn on. */
  floorId: string;
  /** Floor it leads to. */
  targetFloorId: string;
  /** Direction label bounds: [x, y, width, height]. */
  rect?: [number, number, number, number];
  /** Stairs / ramp / bridge outline as SVG path data. */
  area?: string;
}

const box = (x: number, y: number, w: number, h: number) =>
  `M${x} ${y}H${x + w}V${y + h}H${x}Z`;

export const floorLinks: FloorLink[] = [
  // Wintercircus ground floor
  { floorId: "wintercircus-0", targetFloorId: "wintercircus-neg1", rect: [742.5, 1431, 299, 74] },
  { floorId: "wintercircus-0", targetFloorId: "wintercircus-neg1", area: "M1041 1683L1035 1677L1029 1671L1023 1664L1017 1658L1011 1651L1005 1644L1000 1638L994 1631L989 1624L984 1616L979 1609L974 1602L969 1594L965 1587L960 1579L956 1572L952 1564L948 1556L944 1548L940 1540L937 1532L933 1524L930 1516L927 1507L824 1545L828 1555L832 1565L836 1575L841 1585L845 1595L850 1605L855 1614L860 1624L865 1633L871 1643L877 1652L882 1661L888 1670L895 1679L901 1688L907 1697L914 1705L921 1714L928 1722L935 1730L942 1738L950 1746L957 1754L965 1762L1041 1683Z" },
  { floorId: "wintercircus-0", targetFloorId: "wintercircus-neg1", rect: [2345.5, 1008.5, 299, 74] },
  { floorId: "wintercircus-0", targetFloorId: "wintercircus-neg1", area: "M2123 1113L2364 1027L2388 1093L2147 1179L2123 1113Z" },
  { floorId: "wintercircus-0", targetFloorId: "wintercircus-1", rect: [600, 1122, 280, 50] },
  { floorId: "wintercircus-0", targetFloorId: "wintercircus-1", area: "M730 1008L806 932L1027 859L1090 834L1079 840L1067 846L1057 853L1046 860L1035 867L1025 874L1014 882L1004 890L994 898L984 906L975 914L965 923L956 932L947 941L938 950L930 960L921 969L913 979L905 989L897 999L890 1009L883 1020L875 1031L869 1041L862 1052L856 1063L850 1075L844 1086L838 1098L833 1109L730 1008Z" },
  { floorId: "wintercircus-0", targetFloorId: "wintercircus-4", rect: [1994, 1694, 186, 47] },

  // Wintercircus −1
  { floorId: "wintercircus-neg1", targetFloorId: "wintercircus-0", rect: [701, 1547, 220, 47] },
  { floorId: "wintercircus-neg1", targetFloorId: "wintercircus-0", area: "M973 1764L963 1753L952 1743L942 1731L932 1720L923 1709L913 1697L904 1685L896 1672L888 1660L880 1647L872 1634L865 1621L955 1573L961 1584L968 1594L974 1605L981 1615L988 1625L995 1635L1003 1644L1010 1654L1018 1663L1027 1672L1035 1681L1044 1689L973 1764Z" },
  { floorId: "wintercircus-neg1", targetFloorId: "wintercircus-0", rect: [2392, 1091, 225, 82] },
  { floorId: "wintercircus-neg1", targetFloorId: "wintercircus-0", area: "M2122 1112L2363 1022L2388 1098L2141 1178L2122 1112Z" },
  { floorId: "wintercircus-neg1", targetFloorId: "wintercircus-neg2", rect: [2317, 1232, 227, 103] },
  { floorId: "wintercircus-neg1", targetFloorId: "wintercircus-neg2", area: "M2117 1274L2397 1174L2646 1110L2646 1131L2635 1193L2627 1235L2117 1370L2117 1274Z" },
  { floorId: "wintercircus-neg1", targetFloorId: "wintercircus-neg2", area: "M1999 1335L2091 1286L2117 1275L2117 1367L2013 1372L1999 1335Z" },

  // Wintercircus −2
  { floorId: "wintercircus-neg2", targetFloorId: "wintercircus-neg1", rect: [2283, 1258, 189, 89] },
  { floorId: "wintercircus-neg2", targetFloorId: "wintercircus-neg1", area: "M2161 1262L2199 1347L2541 1241L2595 1221L2641 1213L2656 1127L2357 1189L2307 1205L2161 1262Z" },
  { floorId: "wintercircus-neg2", targetFloorId: "vooruit-0", rect: [2433, 1960, 191, 258] },
  { floorId: "wintercircus-neg2", targetFloorId: "vooruit-0", area: "M2599 1450L2706 1450C2726 1450 2736 1460 2736 1480L2736 2520L2664 2520L2664 1639L2567 1639L2587 1522L2599 1450Z" },

  // Wintercircus +1
  { floorId: "wintercircus-1", targetFloorId: "wintercircus-0", rect: [851, 1035, 309, 47] },
  { floorId: "wintercircus-1", targetFloorId: "wintercircus-0", area: "M1169 812L1153 830L1027 865L806 938L768 950L795 1022L862 1011L930 999L998 984L1065 968L1132 952L1186 936L1227 917L1265 894L1297 857L1328 817L1359 786L1359 776L1359 775L1344 775L1328 776L1313 777L1297 779L1282 781L1267 783L1251 786L1236 789L1221 793L1206 797L1191 802L1177 806L1162 812L1169 812Z" },

  // Vooruit meeting hub (level 0)
  { floorId: "vooruit-0", targetFloorId: "vooruit-1", rect: [580, 692, 259, 47] },
  { floorId: "vooruit-0", targetFloorId: "vooruit-1", area: box(620, 769, 50, 172) + box(670, 769, 69, 46) + box(670, 888, 84, 52) },
  { floorId: "vooruit-0", targetFloorId: "wintercircus-neg2", rect: [1865, 330, 301, 258] },
  { floorId: "vooruit-0", targetFloorId: "wintercircus-neg2", area: "M2076 1093L2248 1093C2268 1093 2278 1082 2278 1060L2278 0L2206 0L2206 787L2076 787L2076 1093Z" },

  // Vooruit pitching stage (level +1)
  { floorId: "vooruit-1", targetFloorId: "vooruit-0", rect: [698, 698, 234, 47] },
  { floorId: "vooruit-1", targetFloorId: "vooruit-0", area: box(668, 769, 86, 179) + box(684, 772, 56, 44) + box(612, 820, 54, 76) },
];
