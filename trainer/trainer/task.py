import argparse
import os
from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForCausalLM, TrainingArguments, Trainer
import logging
from pythonjsonlogger import jsonlogger
import os

os.environ["PATH"] += os.pathsep + "/root/.local/bin"

# Setup structured JSON logger
logger = logging.getLogger()
logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter()
logHandler.setFormatter(formatter)
logger.addHandler(logHandler)
logger.setLevel(logging.INFO)

logger.info("✅ Structured logging initialized")


# ---- Argument Parsing ----
parser = argparse.ArgumentParser()
parser.add_argument("--model_name", type=str, required=True)
parser.add_argument("--epochs", type=int, default=2)
parser.add_argument("--learning_rate", type=float, default=2e-5)
args = parser.parse_args()

# ---- Logging ----
print("✅ Training script started...")
print(f"Model: {args.model_name}")
print(f"Epochs: {args.epochs}")
print("Loading dataset from GCS...")

# ---- Load Model & Tokenizer ----
tokenizer = AutoTokenizer.from_pretrained(args.model_name)
model = AutoModelForCausalLM.from_pretrained(args.model_name)

# ---- Load & Tokenize Dataset ----
dataset = load_dataset("json", data_files="gs://reallychangemanagement/datasets/trainer100mb.gz")

def tokenize(sample):
    merged = sample['inputs'] + " " + sample['targets']
    tokens = tokenizer(
        merged,
        truncation=True,
        padding='max_length',
        max_length=1024
    )
    tokens["labels"] = tokens["input_ids"].copy()
    return tokens


tokenized = dataset["train"].map(tokenize)

# ---- Training Arguments ----
training_args = TrainingArguments(
    output_dir="./results",
    per_device_train_batch_size=1,
    gradient_accumulation_steps=4,
    num_train_epochs=args.epochs,
    learning_rate=args.learning_rate,
    fp16=True,
    logging_steps=10,
    save_steps=200,
    save_total_limit=2,
)

# ---- Trainer ----
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized
)

# ---- Train ----
trainer.train()

# ---- Save to Vertex AI Output Path ----
output_path = os.environ.get("AIP_MODEL_DIR", "./final-model")
print(f"✅ Saving model to {output_path}")
trainer.save_model(output_path)
tokenizer.save_pretrained(output_path)

print("✅ Training complete!")
