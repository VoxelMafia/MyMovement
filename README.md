# 🚀 Player Movement Component (Physics-Based)

This component, named `movement`, is responsible for handling the **physics-driven movement** of the player in the scene. It works in conjunction with the **`physx` component (PhysicsBody)** to provide realistic collision detection and response.

---

## ⚙️ Prerequisites & Setup

For this component to function correctly, the following engine and object settings must be in place:

### 1. Engine Physics

The overall physics system must be enabled in the project settings.

* Navigate to **Project Settings** (next to Properties).
* Expand the **Physics** section.
* Ensure the **`enable`** checkbox is checked.

<img width="455" height="353" alt="EnablePhysics" src="https://github.com/user-attachments/assets/6a667a39-4c63-4b99-acc2-9c03b35795e5" />


### 2. Player Object Structure

The player object hierarchy must include a parent object that holds the `physx` component and the `movement` component.

* The parent object should contain the **`PhysicsBody`** component (or your `physx` component).
* The **`PlayerRig`** (or main camera/VR rig) and other relevant controllers/cameras must be children of this parent.

<img width="207" height="177" alt="PlayerSetup_Editor" src="https://github.com/user-attachments/assets/63df21b1-9a74-41a5-9b9b-1a2cbdc84f42" />

### 3. Physics Body Configuration (Component: `physx`)

The `physx` component defines the physical properties and collision shape for the player.

| Setting | Value/State | Notes |
| :--- | :--- | :--- |
| **Shape** | `sphere` | Recommended for smooth character movement. |
| **Radius** | `0.250` | Adjust based on scene scale. |
| **allowSimulation** | Checked | Allows physics forces and updates. |
| **simulate** | Checked | Indicates the player is dynamic (moves). |
| **gravity** | Checked | Allows the player to fall. |
| **mass** | `1.000` | Standard mass. |
| **Angular Locks (X, Y, Z)**| All Checked | **Crucial:** Prevents the player from tipping/rotating due to collisions. |
| **Groups** | `player` | Ensures proper collision filtering. |

<img width="464" height="1166" alt="Setup" src="https://github.com/user-attachments/assets/7ad2bf77-db4b-4b25-80f5-286785e426fb" />


## 💻 `movement` Component Properties

This component handles the logic for taking player input and applying forces or translations.

| Property Name | Description | Default Value | Notes |
| :--- | :--- | :--- | :--- |
| `playerRig` | The main object/transform that holds the camera/VR Rig and is moved by the physics body. | (Reference) | Used to apply movement translations. |
| `eyeLeft`, `eyeRight` | References to the left and right eye objects (for VR/AR). | (Reference) | Used for calculating movement direction relative to player view. |
| `leftController` | Reference to the input object (e.g., VR controller) used for movement. | (Reference) | Used to get linear movement input. |
| `rightController` | Reference to the input object (e.g., VR controller) used for rotation/actions. | (Reference) | Used to get rotational input. |
| `walkSpeed` | The linear speed multiplier for movement. | `6.000` | Adjusts the rate of player movement. |
| `rotationSpeed` | The angular speed multiplier for rotation. | `3.000` | Adjusts how quickly the player rotates. |

---

## 🛠️ Usage

The `movement` component operates in the game loop by:

1.  **Input Reading:** Checking the state of the specified controllers for movement vectors.
2.  **Direction Calculation:** Determining the desired movement direction relative to the player's view (`eyeLeft`/`eyeRight`).
3.  **Physics Application:** Applying an impulse or setting the velocity on the parent object's **`physx`** component using the calculated direction and `walkSpeed`.
4.  **Rotation Handling:** Managing the horizontal rotation of the player object based on input and `rotationSpeed`.
