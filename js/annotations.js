'use strict';
/* global THREE, $ */

import { MODEL_CENTER_POSITION } from './settings.js';

export const annotations = [
  { position: new THREE.Vector3(0, 0 + MODEL_CENTER_POSITION, 0), text: 'Annotation 1' },
  { position: new THREE.Vector3(-2, 2.5 + MODEL_CENTER_POSITION, 0), text: 'Annotation 2' },
  //! TODO
];

const $canvasContainer = $('#ar_model_viewer');

// annotations.forEach((annotation) => {
//   const $annotationElement = $('<div>', { class: 'annotation' })
//     .html(`<div class="annotation-text">${annotation.text}</div>`)
//     .css({
//       position: 'absolute',
//       cursor: 'pointer'
//     });

//   $canvasContainer.append($annotationElement);

//   annotation.element = $annotationElement;
// });

export function updateAnnotations(camera, scene) {
  annotations.forEach(annotation => {
    const screenPosition = annotation.position.clone();
    screenPosition.project(camera);

    const x = (screenPosition.x * 0.5 + 0.5) * $canvasContainer.width();
    const y = (screenPosition.y * -0.5 + 0.5) * $canvasContainer.height();

    $(annotation.element).css({
      left: `${x}px`,
      top: `${y}px`
    });

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(screenPosition, camera);

    let isBehindModel = false;

    scene.traverse((object) => {
      if (object.isMesh) {
        const intersects = raycaster.intersectObject(object, true);
        if (intersects.length > 0 && intersects[0].distance < annotation.position.distanceTo(camera.position)) {
          isBehindModel = true;
        }
      }
    });

    if (isBehindModel) {
      $(annotation.element).css('opacity', 0.1);
    } else {
      $(annotation.element).css('opacity', 1);
    }

    $(annotation.element).on('click', () => {
      const $annotationText = $(annotation.element).find('.annotation-text');
      if ($annotationText.css('display') === 'none' || !$annotationText.css('display')) {
        $annotationText.css('display', 'flex');
      } else {
        $annotationText.css('display', 'none');
      }
    });
  });
}

