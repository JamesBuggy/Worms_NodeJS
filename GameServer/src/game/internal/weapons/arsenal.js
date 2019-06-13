var weaponCodes = require('./internal/weaponsCodes');
var Dynomite = require('./internal/dynomite');
var Grenade = require('./internal/grenade');
var Rocket = require('./internal/rocket');
var Shotgun = require('./internal/shotgun');

module.exports = class Arsenal {

    constructor() {
        this._selected = weaponCodes.grenade;
        this._weapons = {};
        this._weapons[weaponCodes.dynomite] = {
            ammo: 999,
            instance: new Dynomite()
        }
        this._weapons[weaponCodes.grenade] = {
            ammo: 999,
            instance: new Grenade()
        }
        this._weapons[weaponCodes.rocket] = {
            ammo: 999,
            instance: new Rocket()
        }
        this._weapons[weaponCodes.shotgun] = {
            ammo: 999,
            instance: new Shotgun()
        }
    }

    setSelectedWeapon(newWeapon) {
        this._selected = newWeapon;
    }

    getState() {
        var selectedWeapon = this._weapons[this._selected];
        var state = {
            selected: this._selected
        }
        if(selectedWeapon.instance.isActive()) {
            state.activeWeapon = selectedWeapon.instance.getState();
        }
        return state;
    }

    useSelected(worm) {
        var selectedWeapon = this._weapons[this._selected];
        if(selectedWeapon.ammo > 0 && !selectedWeapon.instance.isActive()) {
            selectedWeapon.instance.activate(worm);
            if(selectedWeapon.instance.isActive()) {
                selectedWeapon.ammo--;
            }
        }
    }

    update(dt) {
        var weapons = Object.keys(this._weapons);
        for(var i = 0; i < weapons.length; i++) {
            if(this._weapons[weapons[i]].instance.isActive()) {
                
                this._weapons[weapons[i]].instance.update(dt);
            }
        }
    }
}