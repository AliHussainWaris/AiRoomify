from transformers import LlamaForCausalLM, LlamaTokenizer, GPT2LMHeadModel, GPT2Tokenizer
import torch

gpu_id = 1 if torch.cuda.device_count() > 1 else 0
device = torch.device(f'cuda:{gpu_id}' if torch.cuda.is_available() else 'cpu')

try:
    print(f"Loading LLaMA model on GPU:{gpu_id}")
    model = LlamaForCausalLM.from_pretrained("meta-llama/Llama-2-7b-hf").to(device)
    tokenizer = LlamaTokenizer.from_pretrained("meta-llama/Llama-2-7b-hf")

    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

except Exception as e:
    print(f"LLaMA load failed: {e}. Falling back to GPT-2.")
    model = GPT2LMHeadModel.from_pretrained("gpt2").to(device)
    tokenizer = GPT2Tokenizer.from_pretrained("gpt2")

    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token


def generate_prompt_with_llama(user_input):
    inputs = tokenizer(
        user_input,
        return_tensors='pt',
        padding=True,
        truncation=True
    ).to(device)

    outputs = model.generate(
        inputs['input_ids'],
        attention_mask=inputs['attention_mask'],
        max_length=50,
        num_return_sequences=1,
        pad_token_id=tokenizer.pad_token_id
    )

    return tokenizer.decode(outputs[0], skip_special_tokens=True)