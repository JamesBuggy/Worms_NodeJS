import assetConfig from "./assetConfig"

export class GameAssetManager {

    public assets: {};

    constructor() {
        this.assets = {};
    }

    LoadAssets(onComplete) {
        var assetKeys = Object.keys(assetConfig);
        var assetsLoaded = 0;
        for(var i = 0; i < assetKeys.length; i++) {
            let key = assetKeys[i];
            let asset = new Image();
            asset.width = assetConfig[key].Width;
            asset.height = assetConfig[key].Height;
            asset.onload= () => {
                this.assets[key] = asset;
                assetsLoaded++;
                if(assetsLoaded == assetKeys.length) {
                    onComplete();
                }
            }
            asset.src = assetConfig[key].Source;
        }
    }
}