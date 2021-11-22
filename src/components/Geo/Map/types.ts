export enum MapControlPosition {
  /** Elements are positioned in the center of the bottom row. */
  BOTTOM_CENTER = 11,
  /**
   * Elements are positioned in the bottom left and flow towards the middle.
   * Elements are positioned to the right of the Google logo.
   */
  BOTTOM_LEFT = 10,
  /**
   * Elements are positioned in the bottom right and flow towards the middle.
   * Elements are positioned to the left of the copyrights.
   */
  BOTTOM_RIGHT = 12,
  /**
   * Elements are positioned on the left, above bottom-left elements, and flow
   * upwards.
   */
  LEFT_BOTTOM = 6,
  /** Elements are positioned in the center of the left side. */
  LEFT_CENTER = 4,
  /**
   * Elements are positioned on the left, below top-left elements, and flow
   * downwards.
   */
  LEFT_TOP = 5,
  /**
   * Elements are positioned on the right, above bottom-right elements, and
   * flow upwards.
   */
  RIGHT_BOTTOM = 9,
  /** Elements are positioned in the center of the right side. */
  RIGHT_CENTER = 8,
  /** Elements are positioned on the right, below top-right elements, and flow downwards. */
  RIGHT_TOP = 7,
  /** Elements are positioned in the center of the top row. */
  TOP_CENTER = 2,
  /** Elements are positioned in the top right and flow towards the middle. */
  TOP_LEFT = 1,
  /** Elements are positioned in the top right and flow towards the middle. */
  TOP_RIGHT = 3,
}
