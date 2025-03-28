// New file created to encapsulate the creation tree functionality for Verse 32
import * as THREE from 'three';

// This function builds a self‑referential tree of creations and integrates them into the given group.
// Parameters:
// • creationsGroup: the THREE.Group to which the created objects (and their connecting lines) will be added.
// • agent: the central THREE.Mesh from which the tree emanates.
// • firstLevelCount (optional): number of child creations at the first level (default 3).
export function createCreationTree(creationsGroup, agent, firstLevelCount = 3) {

  // Internal recursive function to create a tree branch.
  function createTree(parent, position, level, maxLevel, angleOffset, children) {
    if (level > maxLevel) return;

    const radius = 0.5 / (level * 0.7);
    const geometry = new THREE.IcosahedronGeometry(radius, 0);
    const material = new THREE.MeshPhysicalMaterial({
      color: level === 1 ? 0xd76d77 : (level === 2 ? 0xe17b93 : 0xffaf7b),
      emissive: level === 1 ? 0xd76d77 : (level === 2 ? 0xe17b93 : 0xffaf7b),
      emissiveIntensity: 0.3,
      metalness: 0.7 - (level * 0.1),
      roughness: 0.2 + (level * 0.1),
      clearcoat: 1.0 - (level * 0.2),
      clearcoatRoughness: 0.2 + (level * 0.1),
      transparent: true,
      opacity: 0.9 - (level * 0.1)
    });
    
    const creation = new THREE.Mesh(geometry, material);
    creation.position.copy(position);
    creation.userData = {
      level: level,
      parent: parent,
      children: [],
      originalPosition: position.clone(),
      pulsePhase: Math.random() * Math.PI * 2,
      orbitRadius: parent ? position.distanceTo(parent.position) : 0,
      orbitSpeed: 0.3 / level,
      orbitAngle: angleOffset || 0
    };

    if (parent && parent.userData) {
      parent.userData.children = parent.userData.children || [];
      parent.userData.children.push(creation);
    }
    
    creationsGroup.add(creation);
    
    // If there is a parent, add a connecting line.
    if (parent) {
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        parent.position || new THREE.Vector3(), 
        position
      ]);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3 - (level * 0.05)
      });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      line.userData = {
        startObject: parent,
        endObject: creation,
        pulsePhase: Math.random() * Math.PI * 2
      };
      creationsGroup.add(line);
    }
    
    // Recursively create child nodes.
    if (children > 0) {
      for (let i = 0; i < children; i++) {
        const childAngle = (i / children) * Math.PI * 2;
        const distance = 1.2 - (level * 0.1);
        const childPosition = new THREE.Vector3(
          position.x + Math.cos(childAngle) * distance,
          position.y + 0.2,
          position.z + Math.sin(childAngle) * distance
        );
        const nextChildren = Math.max(1, children - 1);
        createTree(creation, childPosition, level + 1, maxLevel, childAngle, nextChildren);
      }
    }
    return creation;
  }
  
  // Ensure the agent has a userData block.
  if (!agent.userData) {
    agent.userData = {
      originalPosition: agent.position.clone(),
      children: [],
      level: 0
    };
  }
  
  // Generate the first-level creations.
  for (let i = 0; i < firstLevelCount; i++) {
    const angle = (i / firstLevelCount) * Math.PI * 2;
    const distance = 2;
    const position = new THREE.Vector3(
      Math.cos(angle) * distance,
      0,
      Math.sin(angle) * distance
    );
    createTree(agent, position, 1, 4, angle, 3);
  }
}