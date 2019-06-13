export module Common {

    export function enableFullscreen(): void {
        var elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem['mozRequestFullScreen']) {
            elem['mozRequestFullScreen']();
        } else if (elem['webkitRequestFullscreen']) {
            elem['webkitRequestFullscreen']();
        } else if (elem['msRequestFullscreen']) {
            elem['msRequestFullscreen']();
        }
        screen.orientation.lock('landscape');
    }

    export function disableFullscreen(): void {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document['mozCancelFullScreen']) {
            document['mozCancelFullScreen']();
        } else if (document['webkitExitFullscreen']) {
            document['webkitExitFullscreen']();
        } else if (document['msExitFullscreen']) {
            document['msExitFullscreen']();
        }
        screen.orientation.unlock();
    }

    export function findIndexByProperty(array, property, value): number {
        for(var i = 0; i < array.length; i += 1) {
            if(array[i][property] === value) {
                return i;
            }
        }
        return -1;
    }
}