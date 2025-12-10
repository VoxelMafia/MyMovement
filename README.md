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

### 2. Player Object Structure

The player object hierarchy must include a parent object that holds the `physx` component and the `movement` component.

* The parent object should contain the **`PhysicsBody`** component (or your `physx` component).
* The **`PlayerRig`** (or main camera/VR rig) and other relevant controllers/cameras must be children of this parent.

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

---

## 💻 `movement` Component Properties

This component handles the logic for taking player input and applying forces or translations.

| Property Name | Description | Default Value | Notes |
| :--- | :--- | :--- | :--- |
| `playerRig` | The main object/transform that holds the camera/VR Rig and is moved by the physics body. | (Reference) | Used to
