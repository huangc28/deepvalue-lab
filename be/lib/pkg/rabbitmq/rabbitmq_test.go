package rabbitmq

import "testing"

func TestSummarizeURLStripsCredentials(t *testing.T) {
	got := summarizeURL("amqps://user:secret@raccoon.lmq.cloudamqp.com/awmtkuss")
	want := "amqps://raccoon.lmq.cloudamqp.com/awmtkuss"
	if got != want {
		t.Fatalf("expected %q, got %q", want, got)
	}
}

func TestSummarizeURLKeepsPortAndDefaultVhost(t *testing.T) {
	got := summarizeURL("amqp://guest:guest@localhost:5672/")
	want := "amqp://localhost:5672/(default)"
	if got != want {
		t.Fatalf("expected %q, got %q", want, got)
	}
}
