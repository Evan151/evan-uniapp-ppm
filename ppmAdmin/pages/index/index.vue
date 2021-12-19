<template>
	<scroll-view style="padding: 15px;box-sizing: border-box;">
        
        <uni-card title="基础卡片" sub-title="副标题" extra="额外信息" thumbnail="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/460d46d0-4fcc-11eb-8ff1-d5dcf8779628.png">
    <text>这是一个带头像和双标题的基础卡片，此示例展示了一个完整的卡片。</text>
</uni-card>
		{{ $t("index.text.prompt") }}
		<text style="color: #666; font-size: 15px;">（ v{{adminVersion}}, {{ $t("index.text.vesion") }}）</text>
		<!-- #ifndef H5 -->
		<fix-window />
		<!-- #endif -->
	</scroll-view>
</template>

<script>
	import {
		version
	} from '../../package.json'

	export default {
		data() {
			return {
				adminVersion: version,
			}
		},
		watch: {

		},
		onLoad() {},
	}
</script>

<style>
	/* #ifndef H5 */
	page {
		padding-top: 85px;
	}

	/* #endif */
</style>
