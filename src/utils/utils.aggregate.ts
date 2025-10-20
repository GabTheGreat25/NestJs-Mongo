import { PipelineStage } from "mongoose";
import { LookupOptions } from "src/types";

const lookup = ({
  from,
  localField,
  as,
  pipeline = [],
  project,
}: LookupOptions): PipelineStage => {
  const finalPipeline: PipelineStage[] = project
    ? [...pipeline, { $project: project }]
    : pipeline;

  return {
    $lookup: {
      from,
      let: { localFieldValue: `$${localField}` },
      pipeline: finalPipeline as NonNullable<
        PipelineStage.Lookup["$lookup"]["pipeline"]
      >,
      as,
    },
  };
};

export { lookup };
