# Lexo model training plan

Lexo should not fine-tune a general model on raw contracts as its first step.
For the MVP, the reliable sequence is:

1. Keep official Kazakhstan law in a versioned retrieval corpus.
2. Measure retrieval on a fixed test set.
3. Collect expert corrections only with explicit consent.
4. Review and anonymize corrections.
5. Fine-tune a small open model only after enough approved examples exist.

## Current dataset

Build the dataset:

```bash
npm run kz:dataset
```

Run the retrieval baseline:

```bash
npm run kz:evaluate
```

Generated files live in `data/training/kz-legal-v1`:

- `corpus.jsonl`: official legal passages for RAG.
- `train/dev/test.retrieval.jsonl`: query-to-passage examples.
- `train/dev/test.instruction.jsonl`: extractive instruction seeds.
- `retrieval-eval.json`: baseline retrieval metrics and failures.
- `manifest.json`: provenance, split counts, and safety notes.

The split is deterministic by chunk ID, so metrics stay comparable between
changes. Client documents are not included.

## Quality gate before fine-tuning

Do not fine-tune until there are at least:

- 1,000 expert-approved question/answer examples;
- 300 corrected contract-risk findings;
- a separate test set that was never used for prompting or training;
- anonymization and explicit training consent for every user-derived example.

Recommended first trainable components:

1. A multilingual embedding model or reranker for Kazakhstan legal retrieval.
2. A small instruction model for output structure and legal drafting style.
3. Keep legal facts grounded through RAG even after fine-tuning.

Fine-tuning should improve format, issue spotting, and tone. It must not be
treated as the source of current law.
