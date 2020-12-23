import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faReadme } from '@fortawesome/free-brands-svg-icons'
import {
  faBars,
  faBell, faBookDead, faBookOpen, faCogs, faHome, faInfo, faLayerGroup, faPaintBrush, faPrint, faSearch, faStream,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faBars,
  faBell, faBookDead, faBookOpen, faCogs, faHome, faInfo, faLayerGroup, faPaintBrush, faPrint, faReadme, faSearch, faStream,
  faTimes,
);

export function Icon(props) {
  return <FontAwesomeIcon {...props} />
}
