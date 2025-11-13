import { useState } from "react";
import { Comment } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface CommentSectionProps {
  blogId: string;
  comments: Comment[];
  onAddComment: (username: string, comment: string) => void;
}

const CommentSection = ({ comments, onAddComment }: CommentSectionProps) => {
  const [username, setUsername] = useState("");
  const [commentText, setCommentText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !commentText.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    onAddComment(username, commentText);
    setUsername("");
    setCommentText("");
    toast.success("Comment added successfully!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Textarea
              placeholder="Share your thoughts..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={4}
            />
            <Button type="submit">Post Comment</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold">{comment.username}</h4>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(comment.created_at), "MMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
              <p className="text-muted-foreground">{comment.comment}</p>
            </CardContent>
          </Card>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
