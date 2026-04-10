"use client";
import { motion } from "framer-motion";

interface Node {
  year: string;
  type: "APPLY" | "BANK" | "TROPHY";
  text: string;
  position: "above" | "below";
}

const NODES: Node[] = [
  {
    year: "2026",
    type: "APPLY",
    text: "CO Unit 37 (9% NR odds at 8 pts) + ID OTC archery elk $696 fallback",
    position: "above",
  },
  {
    year: "2027",
    type: "BANK",
    text: "If CO draws: HUNT. If not: bank 9th point. Unit 37 odds hit ~18% at 9 pts",
    position: "below",
  },
  {
    year: "2028",
    type: "APPLY",
    text: "9 pts CO + apply MT Unit 482 (bull elk, ~5% NR odds, builds parallel)",
    position: "above",
  },
  {
    year: "2029–30",
    type: "TROPHY",
    text: "10 pts in CO crosses threshold for Unit 54. This is your draw window.",
    position: "below",
  },
];

function NodeCard({ node }: { node: Node }) {
  if (node.type === "TROPHY") {
    return (
      <div className="bg-amber-brand p-4 max-w-[220px]" style={{ background: "#D4852A" }}>
        <div
          className="font-mono uppercase tracking-wider"
          style={{ fontSize: 11, color: "#0F0D0A", fontWeight: 500 }}
        >
          ✦ TROPHY WINDOW
        </div>
        <p className="font-mono mt-2" style={{ fontSize: 12, color: "#0F0D0A", lineHeight: 1.55 }}>
          {node.text}
        </p>
      </div>
    );
  }

  const isApply = node.type === "APPLY";
  return (
    <div className="max-w-[220px]">
      <div
        className="font-mono"
        style={{ fontSize: 13, color: "#D4852A", letterSpacing: "0.05em" }}
      >
        {node.year}
      </div>
      <div
        className="font-mono uppercase mt-1 inline-block px-2 py-0.5"
        style={{
          fontSize: 11,
          letterSpacing: "0.08em",
          background: isApply ? "#D4852A" : "transparent",
          color: isApply ? "#0F0D0A" : "#D4852A",
          border: isApply ? "none" : "1px solid #D4852A",
          fontWeight: 500,
        }}
      >
        {node.type}
      </div>
      <p
        className="font-mono mt-2"
        style={{ fontSize: 12, color: "#7A6E5F", lineHeight: 1.55 }}
      >
        {node.text}
      </p>
    </div>
  );
}

export default function PlanTimeline() {
  return (
    <div className="relative">
      {/* Desktop horizontal timeline */}
      <div className="hidden md:block relative" style={{ minHeight: 380 }}>
        {/* Track line */}
        <div
          className="absolute left-0 right-0"
          style={{
            top: "50%",
            height: 2,
            background: "#D4852A",
            transform: "translateY(-50%)",
          }}
        />

        {/* Nodes */}
        <div className="relative grid grid-cols-4 gap-4 h-full" style={{ minHeight: 380 }}>
          {NODES.map((node, i) => {
            const isTrophy = node.type === "TROPHY";
            const dotSize = isTrophy ? 20 : 14;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex flex-col items-center justify-center"
              >
                {/* Card above */}
                {node.position === "above" && (
                  <div className="absolute" style={{ bottom: "calc(50% + 20px)" }}>
                    <NodeCard node={node} />
                  </div>
                )}

                {/* Dot */}
                <div
                  className={isTrophy ? "trophy-pulse" : ""}
                  style={{
                    width: dotSize,
                    height: dotSize,
                    borderRadius: "50%",
                    background: isTrophy ? "#F0A040" : node.type === "BANK" ? "transparent" : "#D4852A",
                    border: node.type === "BANK" ? "2px solid #D4852A" : "none",
                    position: "relative",
                    zIndex: 2,
                  }}
                />

                {/* Card below */}
                {node.position === "below" && (
                  <div className="absolute" style={{ top: "calc(50% + 20px)" }}>
                    <NodeCard node={node} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile vertical timeline */}
      <div className="md:hidden flex flex-col gap-6">
        {NODES.map((node, i) => {
          const isTrophy = node.type === "TROPHY";
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex gap-4 items-start"
            >
              <div className="flex flex-col items-center flex-shrink-0 pt-1">
                <div
                  className={isTrophy ? "trophy-pulse" : ""}
                  style={{
                    width: isTrophy ? 20 : 14,
                    height: isTrophy ? 20 : 14,
                    borderRadius: "50%",
                    background: isTrophy ? "#F0A040" : node.type === "BANK" ? "transparent" : "#D4852A",
                    border: node.type === "BANK" ? "2px solid #D4852A" : "none",
                  }}
                />
                {i < NODES.length - 1 && (
                  <div style={{ width: 2, flex: 1, background: "#D4852A", marginTop: 8, minHeight: 60 }} />
                )}
              </div>
              <NodeCard node={node} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
