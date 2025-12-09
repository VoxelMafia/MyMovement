import {Component, Property, PhysXComponent} from '@wonderlandengine/api';
import {vec3, vec4, quat} from 'gl-matrix';

export class Movement extends Component {
    static TypeName = 'movement';

    static Properties = {
        playerRig: Property.object(),
        eyeLeft: Property.object(),
        leftController: Property.object(),
        rightController: Property.object(),
        walkSpeed: Property.float(6.0),
        rotationSpeed: Property.float(3.0),
    };

    start() {
        this._initState();
        this._initInputListeners();
        this._controllersInitialized = false;
    }

    _initState() {
        this._moveDir = vec3.create();
        this._velocity = vec3.create();
        this._up = vec3.fromValues(0, 1, 0);
        this._playerRigRot = vec4.create();
        this._headForward = vec3.create();
        this._headRight = vec3.create();
        
        this.pos = new Float32Array(3);
        this.spawnPos = new Float32Array(3);
        this.object.getPositionWorld(this.spawnPos);
        
        this._physx = this.object.getComponent(PhysXComponent);
        if(this._physx) this._physx.active = true;
        
        this._keys = new Set();
        
        this.isRespawning = false;
        
        // Performance optimization: pre-allocated vectors and variables
        this._tempVelocity = vec3.create();
        this._tempDesiredMove = vec3.create();
        
        // Pre-allocate quaternions for rotation handling
        this._tempRigRot = quat.create();
        this._tempDeltaRot = quat.create();
    }

    _initInputListeners() {
        window.addEventListener('keydown', (e) => this._keys.add(e.code));
        window.addEventListener('keyup', (e) => this._keys.delete(e.code));
        window.addEventListener('blur', () => {
            this._keys.clear();
            if (this._physx && this._physx.linearVelocity) {
                this._physx.linearVelocity[0] = 0;
                this._physx.linearVelocity[2] = 0;
            }
        });
    }

    update(dt) {
        // Controller/component polling and late initialization
        if (!this._controllersInitialized) {
            // Check if both controllers and their input components are available
            // We only need inputs for movement now
            if (this.leftController && this.rightController &&
                this.leftController.getComponent && this.rightController.getComponent &&
                this.leftController.getComponent('input') && this.rightController.getComponent('input')) {
                this._controllersInitialized = true;
            } else {
                // Not ready yet, skip update
                return;
            }
        }  
        const input = this._getInput();

        this._handleRotation(input.rot, dt);
        
        // Performance: reuse pre-allocated vector instead of cloning
        if(this._physx) {
            vec3.copy(this._tempVelocity, this._physx.linearVelocity);
            
            this._updateMoveDirection(input.x, input.y);
            
            // Performance: reuse pre-allocated vector instead of creating new one
            vec3.scale(this._tempDesiredMove, this._moveDir, this.walkSpeed);
            
            this._tempVelocity[0] = this._tempDesiredMove[0];
            this._tempVelocity[2] = this._tempDesiredMove[2];
            
            if (input.x === 0 && input.y === 0) {
                this._tempVelocity[0] = 0;
                this._tempVelocity[2] = 0;
            }
            this._physx.linearVelocity = this._tempVelocity;
        }
    }

    _getInput() {
        const leftInput = this.leftController?.getComponent('input');
        const rightInput = this.rightController?.getComponent('input');
        const gamepadLeft = leftInput?.xrInputSource?.gamepad;
        const gamepadRight = rightInput?.xrInputSource?.gamepad;
        const x = gamepadLeft?.axes?.[2] ?? (this._keys.has('KeyA') ? -1 : this._keys.has('KeyD') ? 1 : 0);
        const y = -(gamepadLeft?.axes?.[3] ?? (this._keys.has('KeyW') ? -1 : this._keys.has('KeyS') ? 1 : 0));
        const rot = gamepadRight?.axes?.[2] ?? (this._keys.has('ArrowLeft') ? -1 : this._keys.has('ArrowRight') ? 1 : 0);
        
        return { x, y, rot };
    }

    _handleRotation(rot, dt) {
        if (this.playerRig && Math.abs(rot) > 0.05) {
            const yaw = -rot * this.rotationSpeed * dt;
            // Use pre-allocated quaternions instead of creating new ones
            this.playerRig.getRotationWorld(this._tempRigRot);
            quat.setAxisAngle(this._tempDeltaRot, this._up, yaw);
            quat.multiply(this._tempRigRot, this._tempDeltaRot, this._tempRigRot);
            this.playerRig.setRotationWorld(this._tempRigRot);
        }
    }

    _updateMoveDirection(x, y) {
        this.eyeLeft.getForwardWorld(this._headForward);
        this.eyeLeft.getRightWorld(this._headRight);
        this._headForward[1] = 0;
        this._headRight[1] = 0;
        vec3.normalize(this._headForward, this._headForward);
        vec3.normalize(this._headRight, this._headRight);
        vec3.set(this._moveDir, 0, 0, 0);
        vec3.scaleAndAdd(this._moveDir, this._moveDir, this._headForward, y);
        vec3.scaleAndAdd(this._moveDir, this._moveDir, this._headRight, x);
        vec3.normalize(this._moveDir, this._moveDir);
    }
}
