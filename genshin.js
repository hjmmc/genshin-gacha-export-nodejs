const ExcelJS = require('exceljs')
const fetch = require('node-fetch')
const util = require('util');
const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
})
const question = util.promisify(readline.question).bind(readline);

const GachaTypesUrl = `https://hk4e-api.mihoyo.com/event/gacha_info/api/getConfigList`;
const GachaLogBaseUrl = `https://hk4e-api.mihoyo.com/event/gacha_info/api/getGachaLog`;

let AuthKey = ''
let AuthKeyVer = '1'
let Lang = 'zh-cn'

async function getGachaLog(key, page, end_id) {
	return fetch(
		GachaLogBaseUrl +
		`?authkey=${AuthKey}` +
		`&authkey_ver=${AuthKeyVer}` +
		`&lang=${Lang}` +
		`&gacha_type=${key}` +
		`&page=${page}` +
		`&size=${20}` +
		`&end_id=${end_id}`
	)
		.then((res) => res.json())
		.then((data) => data);
}

async function getGachaLogs(name, key) {
	let page = 1,
		data = [],
		res = [];
	let end_id = "0";
	let list = [];
	do {
		console.log(`正在获取${name}第${page}页`);
		res = await getGachaLog(key, page, end_id);
		// await sleep(0.2);
		end_id = res.data.list.length > 0 ? res.data.list[res.data.list.length - 1].id : 0;
		list = res.data.list;
		data.push(...list);
		page += 1;
	} while (list.length > 0);
	return data;
}

async function main() {
	const url = await question('请输入 URL:')
	const uri = new URL(url)
	AuthKey = uri.searchParams.get('authkey')
	if (!AuthKey) {
		console.error('AuthKey 获取失败!')
		return
	}
	if (AuthKey.includes('/')) {
		AuthKey = encodeURIComponent(AuthKey)
	}
	AuthKeyVer = uri.searchParams.get('authkey_ver') || '1'
	Lang = uri.searchParams.get('lang') || 'zh-cn'
	
	const gachaTypes = await fetch(`${GachaTypesUrl}?authkey=${AuthKey}&authkey_ver=${AuthKeyVer}&lang=${Lang}`)
		.then((res) => res.json())
		.then((data) => data.data.gacha_type_list);
	console.log("获取抽卡活动类型成功");

	console.log("开始获取抽卡记录");
	const workbook = new ExcelJS.Workbook();
	for (const type of gachaTypes) {
		const sheet = workbook.addWorksheet(type.name, {
			views: [{
				state: "frozen",
				ySplit: 1
			}],
		});
		sheet.columns = [{
			header: "时间",
			key: "time",
			width: 24
		}, {
			header: "名称",
			key: "name",
			width: 14
		}, {
			header: "类别",
			key: "type",
			width: 8
		}, {
			header: "星级",
			key: "rank",
			width: 8
		}, {
			header: "总次数",
			key: "idx",
			width: 8
		}, {
			header: "保底内",
			key: "pdx",
			width: 8
		},];
		// get gacha logs
		const logs = (await getGachaLogs(type.name, type.key)).map((item) => {
			// const match = data.find((v) => v.item_id === item.item_id);
			return [
				item.time,
				item.name,
				item.item_type,
				parseInt(item.rank_type),
			];
		});
		logs.reverse();
		idx = 0;
		pdx = 0;
		for (log of logs) {
			idx += 1;
			pdx += 1;
			log.push(idx, pdx);
			if (log[3] === 5) {
				pdx = 0;
			}
		}
		// console.log(logs);
		sheet.addRows(logs);
		// set xlsx hearer style
		["A", "B", "C", "D", "E", "F"].forEach((v) => {
			sheet.getCell(`${v}1`).border = {
				top: {
					style: "thin",
					color: {
						argb: "ffc4c2bf"
					}
				},
				left: {
					style: "thin",
					color: {
						argb: "ffc4c2bf"
					}
				},
				bottom: {
					style: "thin",
					color: {
						argb: "ffc4c2bf"
					}
				},
				right: {
					style: "thin",
					color: {
						argb: "ffc4c2bf"
					}
				},
			};
			sheet.getCell(`${v}1`).fill = {
				type: "pattern",
				pattern: "solid",
				fgColor: {
					argb: "ffdbd7d3"
				},
			};
			sheet.getCell(`${v}1`).font = {
				name: "微软雅黑",
				color: {
					argb: "ff757575"
				},
				bold: true,
			};
		});
		// set xlsx cell style
		logs.forEach((v, i) => {
			["A", "B", "C", "D", "E", "F"].forEach((c) => {
				sheet.getCell(`${c}${i + 2}`).border = {
					top: {
						style: "thin",
						color: {
							argb: "ffc4c2bf"
						}
					},
					left: {
						style: "thin",
						color: {
							argb: "ffc4c2bf"
						}
					},
					bottom: {
						style: "thin",
						color: {
							argb: "ffc4c2bf"
						}
					},
					right: {
						style: "thin",
						color: {
							argb: "ffc4c2bf"
						}
					},
				};
				sheet.getCell(`${c}${i + 2}`).fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: {
						argb: "ffebebeb"
					},
				};
				// rare rank background color
				const rankColor = {
					3: "ff8e8e8e",
					4: "ffa256e1",
					5: "ffbd6932",
				};
				sheet.getCell(`${c}${i + 2}`).font = {
					name: "微软雅黑",
					color: {
						argb: rankColor[v[3]]
					},
					bold: v[3] != "3",
				};
			});
		});
	}
	console.log("获取抽卡记录结束");
	console.log("正在导出");
	const timestamp = new Date().getTime();
	const filename = `原神抽卡记录导出_${timestamp}.xlsx`
	await workbook.xlsx.writeFile(filename);
	console.log("导出成功", filename);
	process.exit(0)
}

main()