import type { EChartsOption } from "echarts";
import * as charts from "echarts";
import { formatCompactNumber, formatDecimal, formatPercent } from "../utils";
import type { Player } from "../models";

export function echarts(node: HTMLElement, option: EChartsOption | undefined) {
    let chart: charts.ECharts | null = charts.init(node,  "dark", {
        renderer: "svg"
    });

    if(!option) {
        chart.showLoading();
    }
    else {
        chart.hideLoading();
        chart.setOption(option!);
    }

    window.addEventListener('resize', function() {
        chart && chart.resize({
            width: "auto"
        });
    });

    return {
        update(option: EChartsOption) {
            chart!.hideLoading();
            chart!.setOption(option!);
        },
        destroy() {
            chart!.dispose();
            chart = null;
        }
    }
}

