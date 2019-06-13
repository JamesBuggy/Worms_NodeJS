import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Input } from '../../models/entities/input';
import { AuthService } from '../../services/auth.service';
import { Renderer } from './renderer'
import { Utilities } from './utilities'
import { MenuDialog } from './dialogs/menu-dialog.component'
import { WeaponDialog } from './dialogs/weapon-dialog.component'
import { ServerInfo } from '../../models/entities/serverInfo'
import { Network } from '../../common/network'
import { Common } from '../../common/common'
import * as io from 'socket.io-client';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('gameCanvas') 
    private gameCanvasRef: ElementRef;
    @ViewChild('target') 
    private targetRef: ElementRef;
    private canvas: HTMLCanvasElement;
    private target: HTMLElement;
    private socket: SocketIOClient.Socket;
    private gameState: any;
    private renderer: Renderer;
    private serverInfo: ServerInfo;
    private isPlayer: boolean;
    private isGameOver: boolean;

    // Input
    private moveUpdateInterval: any;
    private targetUpdateInterval: any;
    private dialogOpen: boolean;
    private wormMoveDirection: number;
    private targetMoveDirection: number;
    private targetMoveSpeed: number
    private jumping: boolean;

    // Input handlers
    private targetTouchMoveHandler: EventListener;
    private canvasTouchStartHandler: EventListener;
    private canvasTouchEndHandler: EventListener;
    private canvasTouchCancelHandler: EventListener;

    constructor(private route: ActivatedRoute, 
                private router: Router,
                private authService: AuthService,
                private dialog: MatDialog,
                private deviceService: DeviceDetectorService) {

        this.targetUpdateInterval = undefined;
        this.gameState = {};
        this.wormMoveDirection = 0;
        this.targetMoveDirection = 0;
        this.targetMoveSpeed = 2;
        this.jumping = false;
        this.dialogOpen = false;
        this.isPlayer = false;
        this.isGameOver = false;
    }

    ngAfterViewInit(): void {

        if(this.isMobile()) {
            Common.enableFullscreen();
        }

        this.route.data.subscribe((data: { serverInfo: ServerInfo }) => {
            this.serverInfo = data.serverInfo;
            this.target = (<HTMLElement>this.targetRef.nativeElement);
            this.canvas = (<HTMLCanvasElement>this.gameCanvasRef.nativeElement);
            this.socket = io.connect(Network.getGameRoot(this.serverInfo.serverAddr.host, this.serverInfo.serverAddr.port), { rejectUnauthorized: false });
            this.socket.on('connect', () => {
                this.socket.on('authenticated', () => {
                    this.renderer = new Renderer(this.target, this.canvas, this.serverInfo.game.level, () =>{
                        this.socket.emit('ready');
                    });
                    this.socket.on('role', (isPlayer) => {
                        this.isPlayer = isPlayer;
                    });
                    this.socket.on('state', (state) => {
                        this.gameState = state;
                        this.renderer.updateGameState(this.gameState);
                    });    
                    this.socket.on('explosion', (explosion) => {
                        this.renderer.maskTerrain(explosion.x, explosion.y, explosion.r);
                    });
                    this.socket.on('gameOver', (state) => {
                        this.isGameOver = true;
                        this.renderer.updateGameState(state);
                    });

                    // 
                    this.moveUpdateInterval = setInterval(() => {
                        if(this.wormMoveDirection != 0) {
                            var payload = new Input("MOVE", { direction: this.wormMoveDirection });
                            this.socket.emit('input', payload);
                        }
                    }, 1000 / 30);
                    this.targetUpdateInterval = setInterval(() => {
                        if(this.targetMoveDirection != 0) {
                            var worm = Utilities.getActiveWorm(this.gameState);
                            var result = Utilities.rotate(0, 0, worm.aim.x, worm.aim.y, this.targetMoveSpeed * this.targetMoveDirection * worm.direction);
                            var payload = new Input("TARGET", { 
                                x: result.x,
                                y: result.y
                            });
                            this.socket.emit('input', payload);
                        }
                    },  1000 / 30);

                }).on('unauthorized', () => {
                    console.log('Not authorized to join game session');
                    this.authService.logout();
                }).emit('authenticate', {
                    token: localStorage.getItem("auth_token")
                });
            });
            this.setupInputEvents();
        });
    }

    ngOnInit(): void {
        
    }

    ngOnDestroy(): void {
        this.socket.removeAllListeners();
        this.socket.disconnect();
        clearInterval(this.moveUpdateInterval);
        clearInterval(this.targetUpdateInterval);
        this.clearInputEvents();
        this.renderer.destroy();

        if(this.isMobile()) {
            Common.disableFullscreen();
        }
    }
    
    isMobile(): boolean {
        return this.deviceService.isMobile() || this.deviceService.isTablet();
    }

    openWeaponsDialog(): void {
        const dialogRef = this.dialog.open(WeaponDialog);
        dialogRef.afterClosed().subscribe(selectedWeapon => {
            if(selectedWeapon) {
                var payload = new Input("WEAPON", selectedWeapon);
                this.socket.emit('input', payload);
            }
            this.dialogOpen = false;
        });
        this.dialogOpen = true;
    }

    openMenuDialog(): void {
        const dialogRef = this.dialog.open(MenuDialog);
        dialogRef.afterClosed().subscribe(result => {
            if(result === 'EXIT') {
                this.router.navigate(['/servers']);
            }
            this.dialogOpen = false;
        });
        this.dialogOpen = true;
    }

    shoot(): void {
        this.socket.emit('input', new Input("SHOOT"));
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {    
        if(this.dialogOpen)
            return;

        switch (event.keyCode) {
            case 65: // A
            this.wormMoveDirection = -1;
                break;
            case 68: // D
            this.wormMoveDirection = 1;
                break;
            case 87: // W
            this.targetMoveDirection = 1;
                break;
            case 83: // S
            this.targetMoveDirection = -1;
                break;
        }
    }

    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {    
        if(this.dialogOpen)
            return;

        switch (event.keyCode) {
            case 65: // A
            this.wormMoveDirection = 0;
                break;
            case 68: // D
            this.wormMoveDirection = 0;
                break;     
            case 87: // W
            this.targetMoveDirection = 0;
                break;
            case 83: // S
            this.targetMoveDirection = 0;
                break;
            case 32: // Space
            this.socket.emit('input', new Input("JUMP"));
                break;
            case 13: // Enter
            this.socket.emit('input', new Input("SHOOT"));
                break;
        }
    }

    targetTouchMove(event: TouchEvent): void {
        event.preventDefault();
        var worldProperties = this.renderer.getWorldProperties();
        var worldPos = Utilities.screenToWorld(this.canvas, event.touches[0].pageX, event.touches[0].pageY, worldProperties);
        var activeWorm = Utilities.getActiveWorm(this.gameState);
        var payload = new Input("TARGET", { 
            x: worldPos.x - activeWorm.position.x,
            y: worldPos.y - activeWorm.position.y
        });
        this.socket.emit('input', payload);
    }

    canvasTouchStart(event: TouchEvent): void {
        event.preventDefault();
        var worldProperties = this.renderer.getWorldProperties();
        var worldPos = Utilities.screenToWorld(this.canvas, event.touches[0].pageX, event.touches[0].pageY, worldProperties);
        var activeWorm = Utilities.getActiveWorm(this.gameState);

        if(activeWorm != undefined) {

            var x = worldPos.x - activeWorm.position.x;
            var y = worldPos.y - activeWorm.position.y;

            var distance = Math.sqrt(x*x + y*y);
            if(distance <= 60) {
                this.jumping = true;
            }
            else {
                if(worldPos.x > activeWorm.position.x) {
                    this.wormMoveDirection = 1;
                }
                else {
                    this.wormMoveDirection = -1;
                }
            }
        }
    }

    canvasTouchEnd(event: TouchEvent): void {
        event.preventDefault();
        if(this.jumping) {
            this.socket.emit('input', new Input("JUMP"));
        }
        this.wormMoveDirection = 0;
        this.jumping = false;
    }

    canvasTouchCancel(event: TouchEvent): void {
        event.preventDefault();
        this.wormMoveDirection = 0;
        this.jumping = false;
    }

    setupInputEvents(): void {
        this.targetTouchMoveHandler = this.targetTouchMove.bind(this);
        this.canvasTouchStartHandler = this.canvasTouchStart.bind(this);
        this.canvasTouchEndHandler = this.canvasTouchEnd.bind(this);
        this.canvasTouchCancelHandler = this.canvasTouchCancel.bind(this);
        this.target.addEventListener('touchmove', this.targetTouchMoveHandler);
        this.canvas.addEventListener('touchstart', this.canvasTouchStartHandler);
        this.canvas.addEventListener('touchend', this.canvasTouchEndHandler);
        this.canvas.addEventListener('touchcancel', this.canvasTouchCancelHandler);
    }

    clearInputEvents(): void {
        this.target.removeEventListener("touchmove", this.targetTouchMoveHandler);
        this.canvas.removeEventListener("touchstart", this.canvasTouchStartHandler);
        this.canvas.removeEventListener("touchend", this.canvasTouchEndHandler);
        this.canvas.removeEventListener("touchcancel", this.canvasTouchCancelHandler);
    }
}
