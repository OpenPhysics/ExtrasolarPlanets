/**
 * TransitKeyboardHelpContent.ts
 *
 * Content for the keyboard-help dialog (the "?" button in the navigation bar).
 * Left column: how to operate the sliders and the preset combo box. Right
 * column: the basic actions (play/pause, reset).
 */

import {
  BasicActionsKeyboardHelpSection,
  ComboBoxKeyboardHelpSection,
  SliderControlsKeyboardHelpSection,
  TwoColumnKeyboardHelpContent,
} from "scenerystack/scenery-phet";

export class TransitKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
  public constructor() {
    super(
      [new SliderControlsKeyboardHelpSection(), new ComboBoxKeyboardHelpSection()],
      [new BasicActionsKeyboardHelpSection()],
    );
  }
}
