/**
 * Animation engine for the visualizer
 * Uses CSS animations and transitions for smooth effects
 */

// Animation speed multipliers
const SPEED_MULTIPLIERS: Record<number, number> = {
  1: 2.0,   // Slow
  2: 1.5,   // Medium-slow
  3: 1.0,   // Normal
  4: 0.6,   // Fast
  5: 0.3,   // Very fast
};

/**
 * Animates a node being visited (scanning)
 */
export function animateNodeVisit(nodeId: number, speed: number = 3): void {
  const duration = 400 * (SPEED_MULTIPLIERS[speed] || 1);
  const element = document.querySelector(`[data-node-id="${nodeId}"]`) as HTMLElement;
  
  if (element) {
    element.style.transition = `transform ${duration}ms ease-out`;
    element.style.transform = 'scale(1.3)';
    
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, duration / 2);
  }
}

/**
 * Animates the current node being processed
 */
export function animateCurrentNode(nodeId: number, speed: number = 3): void {
  const duration = 300 * (SPEED_MULTIPLIERS[speed] || 1);
  const element = document.querySelector(`[data-node-id="${nodeId}"]`) as HTMLElement;
  
  if (element) {
    element.style.transition = `transform ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
    element.style.transform = 'scale(1.4)';
  }
}

/**
 * Animates a node being blocked
 */
export function animateNodeBlocked(nodeId: number): void {
  const element = document.querySelector(`[data-node-id="${nodeId}"]`) as HTMLElement;
  
  if (element) {
    element.style.transition = 'transform 400ms ease-in-out';
    element.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 200);
  }
}

/**
 * Creates a CSS keyframe animation for path highlighting
 */
export function createPathAnimation(path: number[], speed: number = 3): void {
  const duration = 300 * (SPEED_MULTIPLIERS[speed] || 1);
  
  path.forEach((nodeId, index) => {
    setTimeout(() => {
      const element = document.querySelector(`[data-node-id="${nodeId}"]`) as HTMLElement;
      if (element) {
        element.classList.add('path-highlight');
        element.style.transition = `transform ${duration}ms ease-out`;
        element.style.transform = 'scale(1.2)';
      }
    }, index * (duration / 2));
  });
}

/**
 * Pulse animation for the priority queue update
 */
export function animatePQUpdate(speed: number = 3): void {
  const duration = 300 * (SPEED_MULTIPLIERS[speed] || 1);
  const elements = document.querySelectorAll('.pq-item');
  
  elements.forEach((element, index) => {
    const htmlElement = element as HTMLElement;
    htmlElement.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
    htmlElement.style.opacity = '0';
    htmlElement.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
      htmlElement.style.opacity = '1';
      htmlElement.style.transform = 'translateY(0)';
    }, index * 50);
  });
}

/**
 * Table row highlight animation
 */
export function animateTableRowUpdate(nodeId: number, speed: number = 3): void {
  const duration = 400 * (SPEED_MULTIPLIERS[speed] || 1);
  const element = document.querySelector(`#table-row-${nodeId}`) as HTMLElement;
  
  if (element) {
    element.style.transition = `background-color ${duration}ms ease-out`;
    element.style.backgroundColor = '#fef08a';
    
    setTimeout(() => {
      element.style.backgroundColor = 'transparent';
    }, duration);
  }
}

/**
 * Get animation delay based on speed
 */
export function getStepDelay(speed: number): number {
  return 800 * (SPEED_MULTIPLIERS[speed] || 1);
}

/**
 * Reset node styles
 */
export function resetNodeStyles(nodeIds: number[]): void {
  nodeIds.forEach((nodeId) => {
    const element = document.querySelector(`[data-node-id="${nodeId}"]`) as HTMLElement;
    if (element) {
      element.style.transform = 'scale(1)';
      element.classList.remove('path-highlight');
    }
  });
}
