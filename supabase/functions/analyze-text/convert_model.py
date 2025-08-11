import torch
import os

def convert_to_onnx():
    print("Loading model...")
    
    # Load model state dict
    model_path = './model/model.safetensors'
    state_dict = torch.load(model_path, map_location='cpu')
    
    # Create a simple model
    class SentimentModel(torch.nn.Module):
        def __init__(self):
            super().__init__()
            self.embedding = torch.nn.Embedding(30522, 768)  # BERT vocab size and hidden size
            self.classifier = torch.nn.Linear(768, 3)  # 3 classes
            
        def forward(self, input_ids, attention_mask):
            embeddings = self.embedding(input_ids)
            pooled = embeddings.mean(dim=1)  # Simple mean pooling
            return self.classifier(pooled)
    
    # Create and initialize model
    model = SentimentModel()
    model.load_state_dict(state_dict)
    model.eval()
    
    # Create dummy input
    dummy_input_ids = torch.randint(0, 30522, (1, 10))  # Batch size 1, sequence length 10
    dummy_attention_mask = torch.ones(1, 10)
    
    # Export to ONNX
    print("Converting to ONNX...")
    torch.onnx.export(
        model,
        (dummy_input_ids, dummy_attention_mask),
        './model/model.onnx',
        input_names=['input_ids', 'attention_mask'],
        output_names=['logits'],
        dynamic_axes={
            'input_ids': {0: 'batch_size', 1: 'sequence'},
            'attention_mask': {0: 'batch_size', 1: 'sequence'},
            'logits': {0: 'batch_size'}
        },
        opset_version=12
    )
    
    print("Model converted successfully!")
    print("ONNX model saved to: ./model/model.onnx")

if __name__ == '__main__':
    convert_to_onnx() 