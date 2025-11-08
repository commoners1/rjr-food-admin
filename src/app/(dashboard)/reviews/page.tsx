'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Star, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock sentiment data
  const sentimentData = [
    { name: 'Jan', positive: 45, negative: 5, neutral: 10 },
    { name: 'Feb', positive: 52, negative: 3, neutral: 8 },
    { name: 'Mar', positive: 48, negative: 7, neutral: 12 },
  ];

  const reviews = [
    {
      id: '1',
      product: 'Spicy Ramen',
      user: 'John Doe',
      rating: 5,
      comment: 'Amazing! Best ramen I\'ve ever had.',
      sentiment: 'positive',
      sentimentScore: 0.95,
    },
    {
      id: '2',
      product: 'Gourmet Burger',
      user: 'Jane Smith',
      rating: 4,
      comment: 'Good burger, but a bit too expensive.',
      sentiment: 'neutral',
      sentimentScore: 0.65,
    },
  ];

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <Badge className="bg-green-500">Positive</Badge>;
      case 'negative':
        return <Badge variant="destructive">Negative</Badge>;
      case 'neutral':
        return <Badge variant="secondary">Neutral</Badge>;
      default:
        return <Badge variant="outline">{sentiment}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reviews & Sentiment Dashboard</h1>
          <p className="text-muted-foreground">Monitor customer reviews and sentiment analysis</p>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-2xl font-bold">4.5</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Based on 120 reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Positive Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">85%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Negative Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              <span className="text-2xl font-bold">8%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">-2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reviews" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reviews">All Reviews</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
              <CardDescription>All customer reviews with sentiment analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{review.product}</h3>
                        <p className="text-sm text-muted-foreground">by {review.user}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                        {getSentimentBadge(review.sentiment)}
                      </div>
                    </div>
                    <p className="text-sm">{review.comment}</p>
                    <p className="text-xs text-muted-foreground">
                      Sentiment Score: {review.sentimentScore}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment">
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Trends</CardTitle>
              <CardDescription>Sentiment analysis over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sentimentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="positive" fill="#22c55e" />
                  <Bar dataKey="negative" fill="#ef4444" />
                  <Bar dataKey="neutral" fill="#6b7280" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Review Trends</CardTitle>
              <CardDescription>Review patterns and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Trend analysis coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

