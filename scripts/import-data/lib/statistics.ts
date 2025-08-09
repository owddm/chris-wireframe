export interface ImportStatistics {
  markdownCreated: number;
  markdownUpdated: number;
  markdownUnchanged: number;
  galleryImagesDownloaded: number;
  galleryImagesUnchanged: number;
  galleryImagesDeleted: number;
  metadataCreated: number;
  metadataUnchanged: number;
  metadataNotApplicable: number;
  totalEvents: number;
  totalVenues: number;
  venuesCreated: number;
  venuesUpdated: number;
  venuesUnchanged: number;
  mapsGenerated: number;
  mapsUnchanged: number;
  mapsFailed: number;
  photoBatchesTotal: number;
  photoBatchesAssigned: number;
  photoBatchesUnassigned: number;
  photoBatchesCreated: number;
  photoBatchesUpdated: number;
  photoBatchesUnchanged: number;
}

export function createStatistics(): ImportStatistics {
  return {
    markdownCreated: 0,
    markdownUpdated: 0,
    markdownUnchanged: 0,
    galleryImagesDownloaded: 0,
    galleryImagesUnchanged: 0,
    galleryImagesDeleted: 0,
    metadataCreated: 0,
    metadataUnchanged: 0,
    metadataNotApplicable: 0,
    totalEvents: 0,
    totalVenues: 0,
    venuesCreated: 0,
    venuesUpdated: 0,
    venuesUnchanged: 0,
    mapsGenerated: 0,
    mapsUnchanged: 0,
    mapsFailed: 0,
    photoBatchesTotal: 0,
    photoBatchesAssigned: 0,
    photoBatchesUnassigned: 0,
    photoBatchesCreated: 0,
    photoBatchesUpdated: 0,
    photoBatchesUnchanged: 0,
  };
}
