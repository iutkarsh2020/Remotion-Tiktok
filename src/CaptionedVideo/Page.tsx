import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
// import { TheBoldFont } from "../load-font";
import { fitText } from "@remotion/layout-utils";
import { makeTransform, scale, translateY } from "@remotion/animation-utils";
import { TikTokPage } from "@remotion/captions";

const fontFamily = "Inter";

const DESIRED_FONT_SIZE = 54;
const HIGHLIGHT_COLOR = "#39E508";

const container: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
  top: undefined,
  bottom: 350,
  height: 100,
  width: "fit-content",
  padding: "0 26px",
  backgroundColor: "#9149af",
  borderRadius: 24,
  position: "absolute",
  top: "20%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

export const Page: React.FC<{
  enterProgress: number;
  page: TikTokPage;
}> = ({ enterProgress, page }) => {
  const frame = useCurrentFrame();
  const { width, fps } = useVideoConfig();
  const timeInMs = (frame / fps) * 1000;

  const fittedText = fitText({
    fontFamily,
    text: page.text,
    withinWidth: Infinity,
  });
  
  const fontSize = Math.min(DESIRED_FONT_SIZE, fittedText.fontSize);
  return (
    <AbsoluteFill style={container}>
      <div
        style={{
          fontSize,
          color: "rgba(255, 255, 255, 0.3)",
          paintOrder: "stroke",
          transform: makeTransform([
            scale(interpolate(enterProgress, [0, 1], [0.8, 1])),
            translateY(interpolate(enterProgress, [0, 1], [50, 0])),
          ]),
          fontFamily,
          // textTransform: "uppercase",
        }}
      >
        <span
          style={{
            transform: makeTransform([
              scale(interpolate(enterProgress, [0, 1], [0.8, 1])),
              translateY(interpolate(enterProgress, [0, 1], [50, 0])),
            ]),
          }}
        >
          {page.tokens.map((t) => {
            const startRelativeToSequence = t.fromMs - page.startMs;
            const endRelativeToSequence = t.toMs - page.startMs;

            const active =
              startRelativeToSequence <= timeInMs &&
              endRelativeToSequence > timeInMs;

            return (
              <span
                key={t.fromMs}
                style={{
                  display: "inline-block",
                  whiteSpace: "pre",
                  color: active ? HIGHLIGHT_COLOR : "white",
                }}
              >
                {t.text}
              </span>
            );
          })}
        </span>
      </div>
    </AbsoluteFill>
  );
};
